import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
      must_change_password: user.mustChangePassword,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async changePassword(userId: number, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 12);
    await this.users.update(userId, { passwordHash: hash, mustChangePassword: false });
    return { ok: true };
  }
}
