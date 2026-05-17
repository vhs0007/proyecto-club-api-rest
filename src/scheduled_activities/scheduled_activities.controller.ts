import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ScheduledActivitiesService } from './scheduled_activities.service';
import { CreateScheduledActivityDto } from './dto/request/create-scheduled_activity.dto';
import { UpdateScheduledActivityDto } from './dto/request/update-scheduled_activity.dto';
import { ScheduledActivityResponseDto } from './dto/response/scheduled_activity.response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Scheduled Activities')
@ApiBearerAuth()
@Controller('scheduled-activities')
@UseGuards(AuthGuard)
@Controller('scheduled-activities')
export class ScheduledActivitiesController {
  constructor(private readonly scheduledActivitiesService: ScheduledActivitiesService) {}

  @Post()
  create(@Body() createScheduledActivityDto: CreateScheduledActivityDto): Promise<ScheduledActivityResponseDto> {
    return this.scheduledActivitiesService.create(createScheduledActivityDto);
  }

  @Get()
  findAll(@Query('clubId', ParseIntPipe) clubId: number): Promise<ScheduledActivityResponseDto[]> {
    return this.scheduledActivitiesService.findAll(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number): Promise<ScheduledActivityResponseDto> {
    return this.scheduledActivitiesService.findOne({ id: +id, clubId: clubId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number, @Body() updateScheduledActivityDto: UpdateScheduledActivityDto): Promise<ScheduledActivityResponseDto> {
    return this.scheduledActivitiesService.update({ id: +id, clubId: clubId }, updateScheduledActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number): Promise<void> {
    return this.scheduledActivitiesService.remove({ id: +id, clubId: clubId });
  }
}
