
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface IUsersRepository {
    create(createUserDto: CreateUserDto): Promise<CreateUserDto>;
    findAll(): Promise<CreateUserDto[]>;
    findById(id: number): Promise<CreateUserDto | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<CreateUserDto>;
    delete(id: number): Promise<void>;
}