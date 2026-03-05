import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import type { CreateExpirationDto } from './dto/create-expiration.dto';
import type { UpdateExpirationDto } from './dto/update-expiration.dto';
import { Expiration } from './entities/expiration.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Expiración')
@ApiBearerAuth()
@Controller('expiration')
export class ExpirationController {
  constructor(private readonly expirationService: ExpirationService) {}

  @ApiOperation({ summary: 'Crear expiración' })
  @Post()
  create(@Body() createExpirationDto: CreateExpirationDto): CreateExpirationDto {
    return this.expirationService.create(createExpirationDto);
  }

  @ApiOperation({ summary: 'Obtener todas las expiraciones' })
  @Get()
  findAll(): CreateExpirationDto[] {
    return this.expirationService.findAll();
  }

  @ApiOperation({ summary: 'Obtener expiración por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): CreateExpirationDto | undefined {
    return this.expirationService.findOne(+id) ?? undefined;
  }

  @ApiOperation({ summary: 'Actualizar expiración' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpirationDto: UpdateExpirationDto,
  ): CreateExpirationDto {
    return this.expirationService.update(+id, updateExpirationDto);
  }

  @ApiOperation({ summary: 'Eliminar expiración' })
  @Delete(':id')
  remove(@Param('id') id: string): CreateExpirationDto {
    return this.expirationService.remove(+id);
  }
}
