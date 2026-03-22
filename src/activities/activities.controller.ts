import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/request/create-activities.dto';
import { UpdateActivityDto } from './dto/request/update-activities.dto';
import { ActivityResponseDto } from './dto/response/activity-response.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(AuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear actividad' })
  @ApiBody({ type: CreateActivityDto })
  create(@Body() createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    try{
      return this.activitiesService.create(createActivityDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  findAll(): Promise<ActivityResponseDto[]> {
    try{
      return this.activitiesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener actividad por ID' })
  findOne(@Param('id') id: string): Promise<ActivityResponseDto> {
    try{
      return this.activitiesService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar actividad' })
  @ApiBody({ type: UpdateActivityDto })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
    try{
      return this.activitiesService.update(+id, updateActivityDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar actividad' })
  remove(@Param('id') id: string): Promise<ActivityResponseDto> {
    try{
      return this.activitiesService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
