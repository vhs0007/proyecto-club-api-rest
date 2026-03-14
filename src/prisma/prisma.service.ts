import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require('@prisma/adapter-pg');

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter: adapter as any });
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

