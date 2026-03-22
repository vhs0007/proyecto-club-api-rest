import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    try{
      return this.facilitiesService.create(createFacilityDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las instalaciones' })
  @ApiOkResponse({ description: 'Lista de instalaciones' })
  findAll(): Promise<FacilityResponseDto[]> {
    try{
      return this.facilitiesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener instalación por ID' })
  @ApiOkResponse({ description: 'Instalación encontrada' })
  findOne(@Param('id') id: string): Promise<FacilityResponseDto> {
    try{
      return this.facilitiesService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar instalación' })
  @ApiBody({ type: UpdateFacilityDto })
  @ApiOkResponse({ description: 'Instalación actualizada' })
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponseDto> {
    try{
      return this.facilitiesService.update(+id, updateFacilityDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar instalación' })
  @ApiOkResponse({ description: 'Instalación eliminada' })
  remove(@Param('id') id: string): Promise<FacilityResponseDto> {
    try{
      return this.facilitiesService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

