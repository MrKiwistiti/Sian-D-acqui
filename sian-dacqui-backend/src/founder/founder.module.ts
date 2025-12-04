import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Founder } from './founder.entity';
import { FounderService } from './founder.service';
import { FounderController } from './founder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Founder])],
  controllers: [FounderController],
  providers: [FounderService],
  exports: [FounderService],
})
export class FounderModule {}

