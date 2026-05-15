import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduledActivitiesService } from './scheduled_activities.service';
import { CreateScheduledActivityDto } from './dto/request/create-scheduled_activity.dto';
import { UpdateScheduledActivityDto } from './dto/request/update-scheduled_activity.dto';

@Controller('scheduled-activities')
export class ScheduledActivitiesController {
  constructor(private readonly scheduledActivitiesService: ScheduledActivitiesService) {}

  @Post()
  create(@Body() createScheduledActivityDto: CreateScheduledActivityDto) {
    return this.scheduledActivitiesService.create(createScheduledActivityDto);
  }

  @Get()
  findAll() {
    return this.scheduledActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledActivitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduledActivityDto: UpdateScheduledActivityDto) {
    return this.scheduledActivitiesService.update(+id, updateScheduledActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledActivitiesService.remove(+id);
  }
}
