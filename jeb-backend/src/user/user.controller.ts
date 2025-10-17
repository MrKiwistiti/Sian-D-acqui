import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    // Validation pour l'inscription publique
    if (!dto.email || !dto.name) {
      throw new BadRequestException('Email and name are required');
    }
    
    // Si un mot de passe est fourni, c'est une inscription publique
    if (dto.password) {
      if (dto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }
      
      // Vérifier si l'email existe déjà
      try {
        const existingUser = await this.service.findByEmail(dto.email);
        if (existingUser) {
          throw new BadRequestException('An account with this email already exists');
        }
      } catch (error) {
        // Si l'utilisateur n'est pas trouvé, c'est bon
        if (error.message !== 'User not found') {
          throw error;
        }
      }
    }
    
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
