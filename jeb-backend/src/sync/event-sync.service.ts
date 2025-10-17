import axios, { AxiosInstance } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalSync } from './external-sync.entity';
import { EventService } from '../event/event.service';
import { Event } from '../event/event.entity';

type RawEvent = any;

@Injectable()
export class EventSyncService {
  private readonly log = new Logger(EventSyncService.name);
  private client: AxiosInstance;

  constructor(
    @InjectRepository(ExternalSync) private syncRepo: Repository<ExternalSync>,
    private events: EventService,
  ) {
    const authHeader = process.env.CLIENT_API_AUTH_HEADER || 'X-Group-Authorization';
    const authScheme = process.env.CLIENT_API_AUTH_SCHEME ?? '';
    const token = process.env.CLIENT_API_TOKEN;

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers[authHeader] = authScheme ? `${authScheme} ${token}` : token;

    this.client = axios.create({
      baseURL: process.env.CLIENT_API_BASE_URL,
      headers,
      timeout: 15000,
      validateStatus: () => true,
    });
  }

  async runOnce(): Promise<{ imported: number; updated: number; skipped: number }> {
    let imported = 0, updated = 0, skipped = 0;

    for await (const item of this.iterList()) {
      const apiId = this.extractId(item);
      if (apiId == null) { this.log.warn('Event sans id, skip'); continue; }

      let track = await this.syncRepo.findOne({ where: { entity: 'event', apiId } });

      const itemUpdatedAt = this.extractUpdatedAt(item);
      if (itemUpdatedAt && track?.lastModified && itemUpdatedAt <= track.lastModified) {
        skipped++; continue;
      }

      let rawDetail: RawEvent | null = null;
      try {
        const path = (process.env.CLIENT_API_EVENTS_DETAIL_PATH || '/events/{id}')
                      .replace('{id}', String(apiId));
        const headers: Record<string, string> = {};
        if (track?.etag) headers['If-None-Match'] = track.etag;

        const res = await this.client.get(path, { headers });
        if (res.status === 304) { skipped++; continue; }
        if (res.status >= 200 && res.status < 300) {
          rawDetail = res.data;
          const etag = res.headers['etag'] as string | undefined;
          track = await this.upsertTrack('event', apiId, {
            etag: etag ?? track?.etag ?? null,
            lastModified: itemUpdatedAt ?? track?.lastModified ?? null,
          });
        } else {
          this.log.warn(`GET event detail ${path} -> ${res.status}, fallback list item`);
        }
      } catch (e: any) {
        this.log.warn(`GET event detail (apiId=${apiId}) échoué: ${e.message}`);
      }

      const raw = rawDetail ?? item;
      const partial = this.mapToEvent(raw);

      const before = track?.localId ? await this.events.findOne(track.localId).catch(() => null) : null;
      const saved = await this.events.upsertByApiId(apiId, partial);

      await this.upsertTrack('event', apiId, {
        localId: saved.id,
        lastModified: itemUpdatedAt ?? track?.lastModified ?? null,
      });

      if (!before) imported++;
      else {
        const changed = this.changed(before, saved);
        changed ? updated++ : skipped++;
      }

      await new Promise(r => setTimeout(r, 60));
    }

    return { imported, updated, skipped };
  }

  private async *iterList(): AsyncGenerator<RawEvent, void, unknown> {
    let nextUrl: string | null = process.env.CLIENT_API_EVENTS_LIST_PATH || '/events';

    while (nextUrl) {
      const res = await this.client.get(nextUrl).catch(e => {
        this.log.error(`List events failed: ${e.message}`);
        return { status: 0, data: null, headers: {} } as any;
      });

      if (!res || res.status < 200 || res.status >= 300) {
        this.log.error(`List events HTTP ${res?.status ?? '??'} for ${nextUrl} – stop.`);
        break;
      }

      const body = res.data;
      if (Array.isArray(body)) {
        for (const it of body) yield it;
        const link = res.headers['link'] as string | undefined;
        nextUrl = this.parseLinkHeaderForNext(link);
      } else if (body?.data && Array.isArray(body.data)) {
        for (const it of body.data) yield it;
        nextUrl = body.next || body.links?.next || null;
      } else if (Array.isArray(body?.items)) {
        for (const it of body.items) yield it;
        nextUrl = body?.links?.next || null;
      } else {
        this.log.warn('List events payload unrecognized, stopping.');
        nextUrl = null;
      }
    }
  }

  private parseLinkHeaderForNext(link?: string) {
    if (!link) return null;
    for (const part of link.split(',')) {
      const m = part.match(/<([^>]+)>;\s*rel="?next"?/i);
      if (m) return m[1];
    }
    return null;
  }

  private extractId(item: any): number | null {
    return typeof item?.id === 'number' ? item.id
      : typeof item?.api_id === 'number' ? item.api_id
      : null;
  }

  private extractUpdatedAt(item: any): Date | undefined {
    const v = item?.updated_at || item?.updatedAt || item?.modified_at;
    if (!v) return undefined;
    const d = new Date(v);
    return isNaN(+d) ? undefined : d;
  }

  private async upsertTrack(entity: string, apiId: number, patch: Partial<ExternalSync>) {
    let tr = await this.syncRepo.findOne({ where: { entity, apiId } });
    if (!tr) tr = this.syncRepo.create({ entity, apiId });
    Object.assign(tr, patch);
    return this.syncRepo.save(tr);
  }

  private mapToEvent(raw: any): Partial<Event> {
    const dates =
      raw.dates ? String(raw.dates)
      : (raw.start_date || raw.startDate || raw.starts_at || raw.startsAt)
        ? `${raw.start_date || raw.startDate || raw.starts_at || raw.startsAt}${
            (raw.end_date || raw.endDate || raw.ends_at || raw.endsAt) ? ' - ' + (raw.end_date || raw.endDate || raw.ends_at || raw.endsAt) : ''
          }`
        : (raw.date || raw.datetime) ? String(raw.date || raw.datetime)
        : null;

    return {
      name: raw.name ?? raw.title ?? 'Untitled',
      dates,
      location: raw.location ?? raw.city ?? null,
      description: raw.description ?? raw.details ?? null,
      eventType: raw.event_type ?? raw.type ?? null,
      targetAudience: raw.target_audience ?? raw.audience ?? null,
    };
  }

  private changed(a: Event, b: Event): boolean {
    const keys: (keyof Event)[] = ['name','dates','location','description','eventType','targetAudience'];
    return keys.some(k => (a[k] ?? null) !== (b[k] ?? null));
  }
}
