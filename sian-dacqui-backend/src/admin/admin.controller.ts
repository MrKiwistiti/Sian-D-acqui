import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin')
export class AdminController {
  constructor(private readonly dataSource: DataSource) {}

  @Post('init-db')
  async initDatabase() {
    try {
      const sqlPath = path.join(__dirname, '../../init-db.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      await this.dataSource.query(sql);
      
      return {
        success: true,
        message: 'Database initialized successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
