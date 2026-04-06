import { Injectable, NotFoundException} from '@nestjs/common';
import { UserTypeRepository } from './repository/user_type.repository.impl';
import type { UserTypeResponseDto } from './dto/response/user-type-response.dto';
import type { CreateUserTypeDto } from './dto/request/create-user_type.dto';


@Injectable()
export class UserTypeService {
  constructor(private readonly userTypeRepository: UserTypeRepository) {}

  async findAll(): Promise<UserTypeResponseDto[]> {
    return this.userTypeRepository.findAll();
  }

   async create(createUserTypeDto: CreateUserTypeDto): Promise<UserTypeResponseDto> {
     return this.userTypeRepository.create({ name: createUserTypeDto.name });
   }

  async findOne(id: number): Promise<UserTypeResponseDto> {
    const row = await this.userTypeRepository.findById(id);
    if (!row) throw new NotFoundException('User type not found');
    return row;
  }

  // async update(id: number, updateUserTypeDto: UpdateUserTypeDto): Promise<UserTypeResponseDto> {
  //   const res = await this.userTypeRepository.update(id, updateUserTypeDto);
  //   return res;
  // }

  // async remove(id: number): Promise<void> {
  //   await this.userTypeRepository.delete(id);
  // }
}
