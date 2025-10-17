import { Controller, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('debug/schema')
export class DebugSchemaController {
  constructor(private readonly ds: DataSource) {}

  @Get(':table')
  async getTableSchema(@Param('table') table: string) {
    const rows = await this.ds.query(
      `SELECT
         table_schema,
         table_name,
         column_name,
         data_type,
         is_nullable,
         character_maximum_length,
         column_default
       FROM information_schema.columns
       WHERE lower(table_name) = lower($1)
       ORDER BY ordinal_position`,
      [table],
    );
    return rows;
  }
}
