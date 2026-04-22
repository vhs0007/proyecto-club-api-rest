import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException, Query, ParseIntPipe } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/request/create-membership.dto';
import { UpdateMembershipDto } from './dto/request/update-membership.dto';
import { ApiBearerAuth, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { MembershipResponseDto } from './dto/response/membership-response.dto';

@ApiTags('Membresías')
@ApiBearerAuth()
@Controller('membership')
@UseGuards(AuthGuard)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @ApiOperation({ summary: 'Crear membresía' })
  @Post()
  @ApiBody({ type: CreateMembershipDto })
  create(@Body() createMembershipDto: CreateMembershipDto): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.create(createMembershipDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Obtener todas las membresías' })
  @Get()
  findAll(@Query('clubId') clubId: number): Promise<MembershipResponseDto[]> {
    try{
      return this.membershipService.findAll(clubId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Obtener membresía por ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.findOne({ clubId, id: +id });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOperation({ summary: 'Actualizar membresía' })
  @Patch(':id')
  @ApiBody({ type: UpdateMembershipDto })
  update(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number, @Body() updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.update({ clubId, id: +id }, updateMembershipDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Eliminar membresía' })
  @Delete(':id')
  remove(@Param('id') id: string, @Query('clubId', ParseIntPipe) clubId: number): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.remove({ clubId, id: +id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
