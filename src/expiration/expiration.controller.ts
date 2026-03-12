import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';
import { Expiration } from './entities/expiration.entity';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Expiración')
@ApiBearerAuth()
@Controller('expiration')
@UseGuards(AuthGuard)
export class ExpirationController {
  constructor(private readonly expirationService: ExpirationService) {}

  @ApiOperation({ summary: 'Crear expiración' })
  @Post()
  @ApiBody({ type: CreateExpirationDto })
  async create(@Body() createExpirationDto: CreateExpirationDto): Promise<{ id: number; expirationDate: Date; memberId: number; membershipId: number }> {
    const expiration = await this.expirationService.create(createExpirationDto);
    return {
      id: expiration.id,
      expirationDate: expiration.expirationDate,
      memberId: (expiration.member as { id: number }).id,
      membershipId: (expiration.membership as { id: number }).id,
    };
  }

  @ApiOperation({ summary: 'Obtener todas las expiraciones' })
  @Get()
  findAll(): Promise<Expiration[]> {
    return this.expirationService.findAll();
  }

  @ApiOperation({ summary: 'Obtener expiración por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expiration> {
    return this.expirationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar expiración' })
  @Patch(':id')
  @ApiBody({ type: UpdateExpirationDto })
  update(
    @Param('id') id: string,
    @Body() updateExpirationDto: UpdateExpirationDto,
  ): Promise<Expiration> {
    return this.expirationService.update(+id, updateExpirationDto);
  }

  @ApiOperation({ summary: 'Eliminar expiración' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Expiration> {
    return this.expirationService.remove(+id);
  }
}
