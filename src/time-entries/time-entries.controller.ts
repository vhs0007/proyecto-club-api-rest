import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/request/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/request/update-time-entry.dto';
import { TimeEntryResponseDto } from './dto/response/time-entry.response.dto';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post()
  create(
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntriesService.create(createTimeEntryDto);
  }

  @Get()
  findAll(
    @Query('clubId', ParseIntPipe) clubId: number,
  ): Promise<TimeEntryResponseDto[]> {
    return this.timeEntriesService.findAll(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TimeEntryResponseDto> {
    return this.timeEntriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntriesService.update(+id, updateTimeEntryDto);
  }
}
