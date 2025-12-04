import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Founder } from './founder.entity';
import { CreateFounderDto } from './dto/create-founder.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';

@Injectable()
export class FounderService {
  constructor(@InjectRepository(Founder) private repo: Repository<Founder>) {}

  create(dto: CreateFounderDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Founder not found');
    return e;
  }

  async update(id: number, dto: UpdateFounderDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<Founder>) {
    const existing = await this.repo.findOne({ where: { apiId } });
    if (existing) {
      Object.assign(existing, partial);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ ...partial, apiId }));
  }
  
  async upsertLocalByName(name: string, startupId: number | null) {
    const where = startupId === null
      ? { name, startupId: IsNull() }
      : { name, startupId };
    const existing = await this.repo.findOne({ where });
    if (existing) return existing;
    return this.repo.save(this.repo.create({ name, startupId }));
  }
}
