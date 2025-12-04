import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly tempPassword = process.env.TEMP_PASSWORD || 'mdp123temp';
  private readonly bcryptRounds = 12;

  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  private async ensurePasswordHash(user: User, plain?: string) {
    if (plain !== undefined) {
      const trimmed = plain?.trim() ?? '';
      if (trimmed.length > 0) {
        user.passwordHash = await bcrypt.hash(trimmed, this.bcryptRounds);
        user.mustChangePassword = false;
        return;
      }
      const tmp = this.tempPassword;
      user.passwordHash = await bcrypt.hash(tmp, this.bcryptRounds);
      user.mustChangePassword = true;
      return;
    }

    if (!user.passwordHash) {
      const tmp = this.tempPassword;
      user.passwordHash = await bcrypt.hash(tmp, this.bcryptRounds);
      user.mustChangePassword = true;
    }
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      apiId: dto.apiId ?? null,
      email: dto.email,
      name: dto.name,
      role: dto.role,
      founderId: dto.founderId ?? null,
      investorId: dto.investorId ?? null,
    });

    await this.ensurePasswordHash(user, dto.password);
    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.apiId !== undefined) user.apiId = dto.apiId;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.founderId !== undefined) user.founderId = dto.founderId;
    if (dto.investorId !== undefined) user.investorId = dto.investorId;

    if (dto.password !== undefined) {
      await this.ensurePasswordHash(user, dto.password);
    }

    return this.repo.save(user);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { deleted: true };
  }

  async upsertByApiId(apiId: number, partial: Partial<User>): Promise<User> {
    const existing = await this.repo.findOne({ where: { apiId } });

    if (existing) {
      if (partial.email !== undefined) existing.email = partial.email;
      if (partial.name !== undefined) existing.name = partial.name;
      if (partial.role !== undefined) existing.role = partial.role;
      if (partial.founderId !== undefined) existing.founderId = partial.founderId;
      if (partial.investorId !== undefined) existing.investorId = partial.investorId;

      await this.ensurePasswordHash(existing);
      return this.repo.save(existing);
    }

    const created = this.repo.create({
      apiId,
      email: partial.email!,
      name: partial.name!,
      role: partial.role ?? 'user',
      founderId: partial.founderId ?? null,
      investorId: partial.investorId ?? null,
    });

    await this.ensurePasswordHash(created);
    return this.repo.save(created);
  }
}
