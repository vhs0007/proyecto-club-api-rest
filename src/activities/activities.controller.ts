import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Activity } from './entities/activity.entity';
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
  create(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener actividad por ID' })
  findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar actividad' })
  @ApiBody({ type: UpdateActivityDto })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto): Promise<Activity> {
    return this.activitiesService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar actividad' })
  remove(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.remove(+id);
  }
}
