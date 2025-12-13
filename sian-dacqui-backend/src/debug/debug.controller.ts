import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('debug')
export class DebugController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('check-connection')
  async checkConnection() {
    try {
      const result = await this.dataSource.query('SELECT NOW()');
      return {
        success: true,
        message: 'Database connected',
        time: result[0].now,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        stack: error.stack,
      };
    }
  }

  @Get('check-tables')
  async checkTables() {
    try {
      const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      return {
        success: true,
        tables: tables.map(t => t.table_name),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('pizzas-error')
  async getPizzasError() {
    try {
      const pizzas = await this.dataSource.query('SELECT * FROM pizzas LIMIT 5');
      return {
        success: true,
        count: pizzas.length,
        pizzas,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        code: error.code,
        detail: error.detail,
      };
    }
  }
}
