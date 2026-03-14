import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserTypeService } from './user_type.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserTypeResponseDto } from './dto/response/user-type-response.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User Type')
@ApiBearerAuth()
@Controller('user-type')
@UseGuards(AuthGuard)
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @ApiOperation({ summary: 'Obtener todos los tipos de usuario' })
  @Get()
  findAll(): Promise<UserTypeResponseDto[]> {
    return this.userTypeService.findAll();
  }

  // @Post()
  // @ApiOperation({ summary: 'Crear tipo de usuario' })
  // @ApiBody({ type: CreateUserTypeDto })
  // create(@Body() dto: CreateUserTypeDto): Promise<UserTypeResponseDto> {
  //   return this.userTypeService.create(dto);
  // }

  @ApiOperation({ summary: 'Obtener tipo de usuario por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserTypeResponseDto> {
    return this.userTypeService.findOne(+id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Actualizar tipo de usuario' })
  // @ApiBody({ type: UpdateUserTypeDto })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserTypeDto: UpdateUserTypeDto,
  // ): Promise<UserType> {
  //   return this.userTypeService.update(+id, updateUserTypeDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Eliminar tipo de usuario' })
  // remove(@Param('id') id: string): Promise<void> {
  //   return this.userTypeService.remove(+id);
  // }
}
