import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/request/create-facility.dto';
import { UpdateFacilityDto } from './dto/request/update-facility.dto';
import { Facility } from './entities/facility.entity';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { FacilityResponseDto } from './dto/response/facility-response.dto';

@ApiTags('Facilities')
@ApiBearerAuth()
@Controller('facilities')
@UseGuards(AuthGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear instalación' })
  @ApiBody({ type: CreateFacilityDto })
  @ApiCreatedResponse({ description: 'Instalación creada' })
  create(@Body() createFacilityDto: CreateFacilityDto): Promise<FacilityResponseDto> {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las instalaciones' })
  @ApiOkResponse({ description: 'Lista de instalaciones' })
  findAll(): Promise<FacilityResponseDto[]> {
    return this.facilitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener instalación por ID' })
  @ApiOkResponse({ description: 'Instalación encontrada' })
  findOne(@Param('id') id: string): Promise<FacilityResponseDto> {
    return this.facilitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar instalación' })
  @ApiBody({ type: UpdateFacilityDto })
  @ApiOkResponse({ description: 'Instalación actualizada' })
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponseDto> {
    return this.facilitiesService.update(+id, updateFacilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar instalación' })
  @ApiOkResponse({ description: 'Instalación eliminada' })
  remove(@Param('id') id: string): Promise<FacilityResponseDto> {
    return this.facilitiesService.remove(+id);
  }
}

