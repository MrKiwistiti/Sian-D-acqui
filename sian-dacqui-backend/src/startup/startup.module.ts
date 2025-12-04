import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Startup } from './startup.entity';
import { StartupService } from './startup.service';
import { StartupController } from './startup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Startup])],
  controllers: [StartupController],
  providers: [StartupService],
  exports: [StartupService],
})
export class StartupModule {}
