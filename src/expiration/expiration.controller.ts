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
import { CreateExpirationDto } from './dto/request/create-expiration.dto';
import { UpdateExpirationDto } from './dto/request/update-expiration.dto';
import { ExpirationResponseDto } from './dto/response/expiration-response.dto';
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
  create(@Body() createExpirationDto: CreateExpirationDto): Promise<ExpirationResponseDto> {
    return this.expirationService.create(createExpirationDto);
  }

  @ApiOperation({ summary: 'Obtener todas las expiraciones' })
  @Get()
  findAll(): Promise<ExpirationResponseDto[]> {
    return this.expirationService.findAll();
  }

  @ApiOperation({ summary: 'Obtener expiración por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExpirationResponseDto> {
    return this.expirationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar expiración' })
  @Patch(':id')
  @ApiBody({ type: UpdateExpirationDto })
  update(
    @Param('id') id: string,
    @Body() updateExpirationDto: UpdateExpirationDto,
  ): Promise<ExpirationResponseDto> {
    return this.expirationService.update(+id, updateExpirationDto);
  }

  @ApiOperation({ summary: 'Eliminar expiración' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ExpirationResponseDto> {
    return this.expirationService.remove(+id);
  }
}
