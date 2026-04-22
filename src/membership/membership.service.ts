import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/request/create-membership.dto';
import { UpdateMembershipDto } from './dto/request/update-membership.dto';
import { MembershipRepository } from './repository/membership.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipResponseDto } from './dto/response/membership-response.dto';
import { QueryMembershipRequestDto } from './dto/request/query-membership.request.dto';


@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly prisma: PrismaService,
  ) {}



  async create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        id_clubId_typeId: {
          id: createMembershipDto.userId,
          clubId: createMembershipDto.clubId,
          typeId: createMembershipDto.userTypeId,
        },
      },
    });
    if (!user) throw new BadRequestException('User not found');
    const membershipType = await this.prisma.membership_type.findUnique({ where: { id_clubId: { id: createMembershipDto.type, clubId: createMembershipDto.clubId } } });
    if (!membershipType) throw new BadRequestException('Membership type not found');
    const res = await this.membershipRepository.create(createMembershipDto);
    return res;
  }

  async findAll(clubId: number): Promise<MembershipResponseDto[]> {
    const list = await this.membershipRepository.findAll(clubId);
    return list;
  }

  async findOne(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<MembershipResponseDto> {
    const { clubId, id } = queryMembershipRequestDto;
    const row = await this.membershipRepository.findById({ clubId, id });
    if (!row) throw new NotFoundException('Membership not found');
    return row;
  }

  async update(queryMembershipRequestDto: QueryMembershipRequestDto, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponseDto> {
    const { clubId, id } = queryMembershipRequestDto;
    const row = await this.membershipRepository.findById({ clubId, id });
    if (!row) throw new NotFoundException('Membership not found');
    const membership = await this.prisma.membership.findUnique({
      where: { id_clubId: { id: id, clubId: updateMembershipDto.clubId } },
      select: { clubId: true },
    });
    if (!membership) throw new NotFoundException('Membership not found');
    if (updateMembershipDto.userId !== undefined) {
      const userTypeId = updateMembershipDto.userTypeId ?? row.user.type.id;
      const user = await this.prisma.users.findUnique({
        where: {
          id_clubId_typeId: {
            id: updateMembershipDto.userId,
            clubId: membership.clubId,
            typeId: userTypeId,
          },
        },
      });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateMembershipDto.type !== undefined) {
      const membershipType = await this.prisma.membership_type.findUnique({ where: { id_clubId: { id: updateMembershipDto.type, clubId: updateMembershipDto.clubId } } });
      if (!membershipType) throw new BadRequestException('Membership type not found');
    }
    const updated = await this.membershipRepository.update({ clubId, id }, updateMembershipDto);
    return updated;
  }

  async remove(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<MembershipResponseDto> {
    const { clubId, id } = queryMembershipRequestDto;
    const row = await this.membershipRepository.findById({ clubId, id });
    if (!row) throw new NotFoundException('Membership not found');
    await this.membershipRepository.delete({ clubId, id });
    return row;
  }
}
