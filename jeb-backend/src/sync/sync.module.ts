import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalSync } from './external-sync.entity';
import { StartupModule } from '../startup/startup.module';
import { StartupSyncService } from './startup-sync.service';
import { SyncController } from './sync.controller';
import { UserModule } from '../user/user.module';
import { UserSyncService } from './user-sync.service';
import { InvestorModule } from '../investor/investor.module';
import { InvestorSyncService } from './investor-sync.service';
import { FounderModule } from '../founder/founder.module';
import { PartnerModule } from '../partner/partner.module';
import { PartnerSyncService } from './partner-sync.service';
import { NewsModule } from '../news/news.module';
import { NewsSyncService } from './news-sync.service';
import { EventModule } from '../event/event.module';
import { EventSyncService } from './event-sync.service';
import { SyncOrchestratorService } from './sync.orchestrator.service';


@Module({
  imports: [TypeOrmModule.forFeature([ExternalSync]), StartupModule,
  UserModule, InvestorModule, FounderModule,
  PartnerModule, NewsModule, EventModule
  ],
  providers: [StartupSyncService, UserSyncService,
    InvestorSyncService, PartnerSyncService,
    NewsSyncService, EventSyncService, SyncOrchestratorService
  ],
  controllers: [SyncController],
})
export class SyncModule {}
