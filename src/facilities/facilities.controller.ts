import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import type { CreateFacilityDto } from './dto/create-facility.dto';
import type { UpdateFacilityDto } from './dto/update-facility.dto';
import type { FacilityResponseDto } from './dto/facility-response.dto';
import { AuthGuard } from '../users/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Facilities')
@ApiBearerAuth()
@Controller('facilities')
@UseGuards(AuthGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear instalación' })
  @ApiCreatedResponse({ description: 'Instalación creada' })
  create(@Body() createFacilityDto: CreateFacilityDto): FacilityResponseDto {
    return this.facilitiesService.create(createFacilityDto) as FacilityResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las instalaciones' })
  @ApiOkResponse({ description: 'Lista de instalaciones' })
  findAll(): FacilityResponseDto[] {
    return this.facilitiesService.findAll() as FacilityResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener instalación por ID' })
  @ApiOkResponse({ description: 'Instalación encontrada' })
  findOne(@Param('id') id: string): FacilityResponseDto {
    return this.facilitiesService.findOne(+id) as FacilityResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar instalación' })
  @ApiOkResponse({ description: 'Instalación actualizada' })
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto): FacilityResponseDto {
    return this.facilitiesService.update(+id, updateFacilityDto) as FacilityResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar instalación' })
  @ApiOkResponse({ description: 'Instalación eliminada' })
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(+id);
  }
}

