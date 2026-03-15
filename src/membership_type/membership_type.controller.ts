import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MembershipTypeService } from './membership_type.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembershipTypeResponseDto } from './dto/response/membership_type-response.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Membership Type')
@ApiBearerAuth()
@Controller('membership-type')
@UseGuards(AuthGuard)
export class MembershipTypeController {
  constructor(private readonly membershipTypeService: MembershipTypeService) {}

  @ApiOperation({ summary: 'Obtener todos los tipos de membresía' })
  @Get()
  findAll(): Promise<MembershipTypeResponseDto[]> {
    return this.membershipTypeService.findAll();
  }

  // @Post()
  // @ApiOperation({ summary: 'Crear tipo de membresía' })
  // @ApiBody({ type: CreateMembershipTypeDto })
  // create(@Body() dto: CreateMembershipTypeDto): Promise<MembershipTypeResponseDto> {
  //   return this.membershipTypeService.create(dto);
  // }

  @ApiOperation({ summary: 'Obtener tipo de membresía por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<MembershipTypeResponseDto> {
    return this.membershipTypeService.findOne(+id);
  }

  // @ApiOperation({ summary: 'Actualizar tipo de membresía' })
  // @Patch(':id')
  // @ApiBody({ type: UpdateMembershipTypeDto })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMembershipTypeDto: UpdateMembershipTypeDto,
  // ): Promise<MembershipType> {
  //   return this.membershipTypeService.update(+id, updateMembershipTypeDto);
  // }

  // @ApiOperation({ summary: 'Eliminar tipo de membresía' })
  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<void> {
  //   return this.membershipTypeService.remove(+id);
  // }
}
