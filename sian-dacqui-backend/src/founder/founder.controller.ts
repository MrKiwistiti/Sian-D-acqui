import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';

@Controller('founders')
export class FounderController {
  constructor(private readonly service: FounderService) {}

  @Post()
  create(@Body() dto: CreateFounderDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFounderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
