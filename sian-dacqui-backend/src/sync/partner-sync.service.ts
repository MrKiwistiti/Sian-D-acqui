import axios, { AxiosInstance } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalSync } from './external-sync.entity';
import { PartnerService } from '../partner/partner.service';
import { Partner } from '../partner/partner.entity';

type RawPartner = any;

@Injectable()
export class PartnerSyncService {
  private readonly log = new Logger(PartnerSyncService.name);
  private client: AxiosInstance;

  constructor(
    @InjectRepository(ExternalSync) private syncRepo: Repository<ExternalSync>,
    private partners: PartnerService,
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
      if (apiId == null) { this.log.warn('Partner sans id, skip'); continue; }

      let track = await this.syncRepo.findOne({ where: { entity: 'partner', apiId } });

      const itemUpdatedAt = this.extractUpdatedAt(item);
      if (itemUpdatedAt && track?.lastModified && itemUpdatedAt <= track.lastModified) {
        skipped++; continue;
      }

      let rawDetail: RawPartner | null = null;
      try {
        const path = (process.env.CLIENT_API_PARTNERS_DETAIL_PATH || '/partners/{id}')
                      .replace('{id}', String(apiId));
        const headers: Record<string, string> = {};
        if (track?.etag) headers['If-None-Match'] = track.etag;

        const res = await this.client.get(path, { headers });
        if (res.status === 304) { skipped++; continue; }
        if (res.status >= 200 && res.status < 300) {
          rawDetail = res.data;
          const etag = res.headers['etag'] as string | undefined;
          track = await this.upsertTrack('partner', apiId, {
            etag: etag ?? track?.etag ?? null,
            lastModified: itemUpdatedAt ?? track?.lastModified ?? null,
          });
        } else {
          this.log.warn(`GET partner detail ${path} -> ${res.status}, fallback list item`);
        }
      } catch (e: any) {
        this.log.warn(`GET partner detail (apiId=${apiId}) échoué: ${e.message}`);
      }

      const raw = rawDetail ?? item;
      const partial = this.mapToPartner(raw);

      const before = track?.localId ? await this.partners.findOne(track.localId).catch(() => null) : null;
      const saved = await this.partners.upsertByApiId(apiId, partial);

      await this.upsertTrack('partner', apiId, {
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

  private async *iterList(): AsyncGenerator<RawPartner, void, unknown> {
    let nextUrl: string | null = process.env.CLIENT_API_PARTNERS_LIST_PATH || '/partners';

    while (nextUrl) {
      const res = await this.client.get(nextUrl).catch(e => {
        this.log.error(`List partners failed: ${e.message}`);
        return { status: 0, data: null, headers: {} } as any;
      });

      if (!res || res.status < 200 || res.status >= 300) {
        this.log.error(`List partners HTTP ${res?.status ?? '??'} for ${nextUrl} – stop.`);
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
        this.log.warn('List partners payload unrecognized, stopping.');
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

  private mapToPartner(raw: any): Partial<Partner> {
    return {
        name: raw.name ?? raw.title ?? 'Unnamed',
        email: raw.email ?? 'no-reply@example.com',
        legalStatus: raw.legal_status ?? raw.legalStatus ?? null,
        address: raw.address ?? null,
        phone: raw.phone ?? null,
        createdAt: raw.created_at ? new Date(raw.created_at)
                : raw.createdAt ? new Date(raw.createdAt) : null,
        description: raw.description ?? null,
        partnershipType: raw.partnership_type ?? raw.partnershipType ?? null,
    };
    }

  private changed(a: Partner, b: Partner): boolean {
    const keys: (keyof Partner)[] = ['name', 'email'];
    return keys.some(k => (a[k] ?? null) !== (b[k] ?? null));
  }
}
