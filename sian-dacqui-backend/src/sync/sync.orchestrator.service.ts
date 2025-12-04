import { Injectable } from '@nestjs/common';
import { StartupSyncService } from './startup-sync.service';
import { InvestorSyncService } from './investor-sync.service';
import { PartnerSyncService } from './partner-sync.service';
import { NewsSyncService } from './news-sync.service';
import { EventSyncService } from './event-sync.service';
import { UserSyncService } from './user-sync.service';

@Injectable()
export class SyncOrchestratorService {
  constructor(
    private readonly startups: StartupSyncService,
    private readonly investors: InvestorSyncService,
    private readonly partners: PartnerSyncService,
    private readonly news: NewsSyncService,
    private readonly events: EventSyncService,
    private readonly users: UserSyncService,
  ) {}

  async runAll() {
    const r1 = await this.startups.runOnce();
    const r2 = await this.investors.runOnce();
    const r3 = await this.partners.runOnce();
    const r4 = await this.news.runOnce();
    const r5 = await this.events.runOnce();
    const r6 = await this.users.runOnce();

    //const r7 = await this.users.backfillFoundersFromLocalUsers();

    return {
      startups: r1, investors: r2, partners: r3, news: r4, events: r5, users: r6,
      //foundersFromUsers: r7,
    };
  }
}
