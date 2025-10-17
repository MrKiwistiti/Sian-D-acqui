import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(@InjectRepository(Partner) private repo: Repository<Partner>) {}

  create(dto: CreatePartnerDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Partner not found');
    return e;
  }

  async update(id: number, dto: UpdatePartnerDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<Partner>) {
    const existing = await this.repo.findOne({ where: { apiId } });
    if (existing) {
      Object.assign(existing, partial);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ ...partial, apiId }));
  }
}
