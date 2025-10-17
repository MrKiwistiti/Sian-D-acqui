import { Controller, Post, Headers, ForbiddenException } from '@nestjs/common';
import { StartupSyncService } from './startup-sync.service';
import { UserSyncService } from './user-sync.service';
import { InvestorSyncService } from './investor-sync.service';
import { PartnerSyncService } from './partner-sync.service';
import { NewsSyncService } from './news-sync.service';
import { EventSyncService } from './event-sync.service';
import { SyncOrchestratorService } from './sync.orchestrator.service';




@Controller('sync')
export class SyncController {
  constructor(
    private readonly startupSync: StartupSyncService,
    private readonly userSync: UserSyncService,
    private readonly investorSync: InvestorSyncService,
    private readonly partnerSync: PartnerSyncService,
    private readonly newsSync: NewsSyncService,
    private readonly eventSync: EventSyncService,
    private readonly orchestrator: SyncOrchestratorService,
  ) {}

  private check(secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
  }

  @Post('all')
  async syncAll(@Headers('x-sync-secret') secret?: string) {
    this.check(secret);
    return this.orchestrator.runAll();
  }

  @Post('startups')
  async syncStartups(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.startupSync.runOnce();
  }

  @Post('users')
  async syncUsers(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.userSync.runOnce();
  }

  @Post('investors')
  async syncInvestors(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.investorSync.runOnce();
  }

  @Post('partners')
  async syncPartners(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.partnerSync.runOnce();
  }

  @Post('news')
  async syncNews(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.newsSync.runOnce();
  }

  @Post('events')
  async syncEvents(@Headers('x-sync-secret') secret?: string) {
    if (process.env.SYNC_SECRET && secret !== process.env.SYNC_SECRET) {
      throw new ForbiddenException('Bad sync secret');
    }
    return this.eventSync.runOnce();
  }
}
