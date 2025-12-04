import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investor } from './investor.entity';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Investor])],
  controllers: [InvestorController],
  providers: [InvestorService],
  exports: [InvestorService],
})
export class InvestorModule {}
