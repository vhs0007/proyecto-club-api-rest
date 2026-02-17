import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import type { CreateActivitiesDto } from './dto/create-activities.dto';
import type { UpdateActivitiesDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('activities')
@UseGuards(AuthGuard) 
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivitiesDto: CreateActivitiesDto) {
    return this.activitiesService.create(createActivitiesDto);
  }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivitiesDto: UpdateActivitiesDto) {
    return this.activitiesService.update(+id, updateActivitiesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}

