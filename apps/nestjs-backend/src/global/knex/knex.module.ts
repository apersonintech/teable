import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { parseDsn } from '../../utils/parse-dsn';

@Module({})
export class TeableKnexModule {
  static register(): DynamicModule {
    return KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.getOrThrow<string>('PRISMA_DATABASE_URL');
        const { driver } = parseDsn(databaseUrl);

        return {
          config: {
            client: driver,
            useNullAsDefault: true,
          },
        };
      },
    });
  }
}