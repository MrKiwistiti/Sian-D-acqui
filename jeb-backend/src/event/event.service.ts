import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {}

  create(dto: CreateEventDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Event not found');
    return e;
  }

  async update(id: number, dto: UpdateEventDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<Event>) {
    const existing = await this.repo.findOne({ where: { apiId } });
    if (existing) {
      Object.assign(existing, partial);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ ...partial, apiId }));
  }
}
