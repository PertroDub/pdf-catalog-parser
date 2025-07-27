import * as dotenv from 'dotenv';
import { CONFIG_TYPES } from './config.type';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export const config: CONFIG_TYPES = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP: {
    PORT: parseInt(process.env.APP_PORT || '8000', 10),
    CORS_ALLOWED_ORIGINS: process.env.APP_CORS_ORIGINS?.split(',') || ['*'],
  },
  DATABASE: {
    TYPE: process.env.DATABASE_TYPE || 'postgres',
    HOST: process.env.DATABASE_HOST || 'localhost',
    PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE: process.env.DATABASE_NAME,
    ENTITIES: ['dist/**/*.entity{.ts,.js}'],
    SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE === 'true',
    LOGGING: process.env.DATABASE_LOGGING === 'true',
    MIGRATIONS: ['dist/migrations/*.js'],
    MIGRATIONS_RUN: process.env.DATABASE_MIGRATIONS_RUN === 'true',
    MIGRATIONS_DIR: 'migrations',
  },
};

export default config;
