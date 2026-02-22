import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import type { CreateActivitiesDto } from './dto/create-activities.dto';
import type { UpdateActivitiesDto } from './dto/update-user.dto';
import { AuthGuard } from '../users/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(AuthGuard) 
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear actividad' })
  create(@Body() createActivitiesDto: CreateActivitiesDto) {
    return this.activitiesService.create(createActivitiesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener actividad por ID' })
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar actividad' })
  update(@Param('id') id: string, @Body() updateActivitiesDto: UpdateActivitiesDto) {
    return this.activitiesService.update(+id, updateActivitiesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar actividad' })
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
