import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private repo: Repository<News>) {}

  create(dto: CreateNewsDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ order: { newsDate: 'DESC', id: 'DESC' } });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('News not found');
    return e;
  }

  async update(id: number, dto: UpdateNewsDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<News>) {
    const existing = await this.repo.findOne({ where: { apiId } });
    if (existing) {
      Object.assign(existing, partial);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ ...partial, apiId }));
  }
}
