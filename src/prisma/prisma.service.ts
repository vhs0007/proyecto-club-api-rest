import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { PoolConfig } from 'pg';

/** Postgres en Render usa certificados que Node no valida con la CA por defecto. */
function needsFlexibleSslForConnection(connectionString: string): boolean {
  if (process.env.RENDER === 'true') {
    return true;
  }
  try {
    const normalized = connectionString.replace(
      /^postgresql(\+[\w]+)?:/i,
      'http:',
    );
    const host = new URL(normalized).hostname.toLowerCase();
    return host.includes('render.com') || host.startsWith('dpg-');
  } catch {
    return false;
  }
}

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
    if (needsFlexibleSslForConnection(connectionString)) {
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
