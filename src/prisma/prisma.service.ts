import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { PoolConfig } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error(
        'Falta DATABASE_URL. Definila en .env (local) o en el panel de Render al vincular PostgreSQL.',
      );
    }

    const poolConfig: PoolConfig = { connectionString };
    if (process.env.RENDER === 'true') {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    const adapter = new PrismaPg(poolConfig);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      console.log('conectandose a la base...');
      await this.$connect();
    } catch (error) {
      console.error(error);
      throw new Error('no se pudo conectar a la base de datos');
    }
  }

  async onModuleDestroy() {
    try {
      console.log('desconectandose de la base...');
      await this.$disconnect();
    } catch (error) {
      console.error(error);
      throw new Error('no se pudo desconectar de la base de datos');
    }
  }
}

