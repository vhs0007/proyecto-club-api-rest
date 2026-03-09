import { PrismaService } from "src/prisma/prisma.service";
import { IMembershipTypeRepository } from "./membership_type.repository";
import { CreateMembershipTypeDto } from "../dto/create-membership_type.dto";
import { MembershipType } from "../entities/membership_type.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MembershipTypeRepository implements IMembershipTypeRepository {
    constructor(private readonly prisma: PrismaService) {}

    /*async create(createMembershipTypeDto: CreateMembershipTypeDto): Promise<MembershipType> {
        return this.prisma.membershipType.create({
            data: createMembershipTypeDto,
        });
    }*/

    async findAll(): Promise<MembershipType[]> {
        return this.prisma.membershipType.findMany();
    }

    async findById(id: number): Promise<MembershipType | null> {
        return this.prisma.membershipType.findUnique({ where: { id } });
    }
    
    async update(id: number, updateMembershipTypeDto: MembershipType): Promise<MembershipType> {
        return this.prisma.membershipType.update({ where: { id }, data: updateMembershipTypeDto });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.membershipType.delete({ where: { id } });
    }
}