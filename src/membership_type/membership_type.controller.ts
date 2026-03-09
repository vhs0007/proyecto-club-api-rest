import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembershipTypeService } from './membership_type.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembershipType } from './entities/membership_type.entity';

@ApiTags('Membership Type')
@ApiBearerAuth()
@Controller('membership-type')
export class MembershipTypeController {
  constructor(private readonly membershipTypeService: MembershipTypeService) {}

  /*@ApiOperation({ summary: 'Crear tipo de membresía' })
  @Post()
  /*create(@Body() createMembershipTypeDto: CreateMembershipTypeDto) {
    return this.membershipTypeService.create(createMembershipTypeDto);
  }*/

  @ApiOperation({ summary: 'Obtener todos los tipos de membresía' })
  @Get()
  findAll() {
    return this.membershipTypeService.findAll();
  }

  @ApiOperation({ summary: 'Obtener tipo de membresía por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipTypeService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar tipo de membresía' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipTypeDto: MembershipType) {
    return this.membershipTypeService.update(+id, updateMembershipTypeDto);
  }

  @ApiOperation({ summary: 'Eliminar tipo de membresía' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipTypeService.remove(+id);
  }
}
