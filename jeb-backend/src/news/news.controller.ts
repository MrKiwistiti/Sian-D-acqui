import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Post()
  create(@Body() dto: CreateNewsDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Get(':id/image')
  async proxyImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const base = process.env.CLIENT_API_BASE_URL || 'https://api.jeb-incubator.com';
    const token = process.env.CLIENT_API_TOKEN || '';
    const authHeader = process.env.CLIENT_API_AUTH_HEADER || 'X-Group-Authorization';
    const imgPath = (process.env.CLIENT_API_NEWS_IMAGE_PATH || '/news/{id}/image').replace('{id}', String(id));
    try {
      const upstream = await axios.get(`${base}${imgPath}`, {
        headers: { [authHeader]: token, Accept: 'image/*' },
        responseType: 'stream',
        validateStatus: () => true,
      });
      if (upstream.status >= 200 && upstream.status < 300) {
        if (upstream.headers['content-type']) {
          res.setHeader('Content-Type', upstream.headers['content-type']);
        }
        res.setHeader('Cache-Control', 'public, max-age=300');
        return upstream.data.pipe(res);
      }
      res.status(upstream.status).send('Image fetch failed');
    } catch (e: any) {
      res.status(502).send('Upstream image error');
    }
  }
}
