import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Startup } from './startup.entity';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';

@Injectable()
export class StartupService {
  constructor(@InjectRepository(Startup) private repo: Repository<Startup>) {}

  create(dto: CreateStartupDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Startup not found');
    return s;
  }

  async update(id: number, dto: UpdateStartupDto) {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: number) {
    const s = await this.findOne(id);
    await this.repo.remove(s);
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<Startup>) {
    const existing = await this.repo.findOne({ where: { apiId } });
    if (existing) {
      Object.assign(existing, partial);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ ...partial, apiId }));
  }
}
