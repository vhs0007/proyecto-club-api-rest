import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembershipService } from './membership.service';
import type { CreateMembershipDto } from './dto/create-membership.dto';
import type { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Membresías')
@ApiBearerAuth()
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @ApiOperation({ summary: 'Crear membresía' })
  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto): Membership {
    return this.membershipService.create(createMembershipDto);
  }

  @ApiOperation({ summary: 'Obtener todas las membresías' })
  @Get()
  findAll(): Membership[] {
    return this.membershipService.findAll();
  }

  @ApiOperation({ summary: 'Obtener membresía por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Membership | undefined {
    return this.membershipService.findOne(+id) ?? undefined;
  }

  @ApiOperation({ summary: 'Actualizar membresía' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto): Membership {
    return this.membershipService.update(+id, updateMembershipDto);
  }

  @ApiOperation({ summary: 'Eliminar membresía' })
  @Delete(':id')
  remove(@Param('id') id: string): Membership {
    return this.membershipService.remove(+id);
  }
}
