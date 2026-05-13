import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { FacilityWorkersService } from './facility_workers.service';
import { CreateFacilityWorkerDto } from './dto/request/create-facility_worker.dto';
import { UpdateFacilityWorkerDto } from './dto/request/update-facility_worker.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacilityWorkerResponseDto } from './dto/response/facility_worker.response.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Facility Workers')
@ApiBearerAuth()
@Controller('facility-workers')
@UseGuards(AuthGuard)
export class FacilityWorkersController {
  constructor(private readonly facilityWorkersService: FacilityWorkersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear trabajador de instalación' })
  @ApiBody({ type: CreateFacilityWorkerDto })
  @ApiCreatedResponse({ description: 'Trabajador de instalación creado' })
  create(@Body() createFacilityWorkerDto: CreateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
    return this.facilityWorkersService.create(createFacilityWorkerDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacilityWorkerDto: UpdateFacilityWorkerDto) {
    return this.facilityWorkersService.update(+id, updateFacilityWorkerDto);
  }
}
