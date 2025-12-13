import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default new DataSource(
  isProduction && databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        synchronize: false,
        logging: true,
        entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
        migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'sian_dacqui_db',
        synchronize: false,
        logging: true,
        entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
        migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
      }
);
