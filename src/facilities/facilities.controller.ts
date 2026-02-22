import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import type { CreateFacilityDto } from './dto/create-facility.dto';
import type { UpdateFacilityDto } from './dto/update-facility.dto';
import { AuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Facilities')
@ApiBearerAuth()
@Controller('facilities')
@UseGuards(AuthGuard) 
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear instalación' })
  create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las instalaciones' })
  findAll() {
    return this.facilitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener instalación por ID' })
  findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar instalación' })
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto) {
    return this.facilitiesService.update(+id, updateFacilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar instalación' })
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(+id);
  }
}

