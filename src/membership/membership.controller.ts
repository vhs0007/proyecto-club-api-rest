import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/request/create-membership.dto';
import { UpdateMembershipDto } from './dto/request/update-membership.dto';
import { Membership } from './entities/membership.entity';
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
  findAll(): Promise<MembershipResponseDto[]> {
    try{
      return this.membershipService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Obtener membresía por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOperation({ summary: 'Actualizar membresía' })
  @Patch(':id')
  @ApiBody({ type: UpdateMembershipDto })
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.update(+id, updateMembershipDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Eliminar membresía' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<MembershipResponseDto> {
    try{
      return this.membershipService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
