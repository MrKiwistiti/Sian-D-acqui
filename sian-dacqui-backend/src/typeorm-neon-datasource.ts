import { DataSource } from 'typeorm';

export const AppDataSourceNeon = new DataSource({
  type: 'postgres',
  url: process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  synchronize: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
