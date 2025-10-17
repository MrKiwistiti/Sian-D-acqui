import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StartupModule } from './startup/startup.module';
import { SyncModule } from './sync/sync.module';
import { DebugModule } from './debug/debug.module';
import { UserModule } from './user/user.module';
import { InvestorModule } from './investor/investor.module';
import { FounderModule } from './founder/founder.module';
import { PartnerModule } from './partner/partner.module';
import { NewsModule } from './news/news.module';
import { EventModule } from './event/event.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER ?? process.env.DB_USERNAME,
        password: process.env.DB_PASS ?? process.env.DB_PASSWORD,
        database: process.env.DB_NAME ?? process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: ['error'],
      }),
    }),
    StartupModule,
    SyncModule,
    DebugModule,
    UserModule,
    InvestorModule,
    FounderModule,
    PartnerModule,
    NewsModule,
    EventModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
