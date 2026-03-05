import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
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

