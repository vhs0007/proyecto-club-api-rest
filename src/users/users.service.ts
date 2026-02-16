import {
  BadRequestException, Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Athlete, Gender } from './entities/athlete.entity';
import { Member, MemberRole } from './entities/member.entity';
import { Worker, WorkerRole } from './entities/worker.entity';
import { UserType } from './entities/user.entity';

@Injectable()
export class UsersService {
  members: Member[] = [
    new Athlete({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      createdAt: new Date('2026-01-01'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      role: MemberRole.Standard,
      weight: 80,
      height: 180,
      gender: Gender.MALE,
      birthDate: new Date('1990-01-01'),
      diet: 'vegetarian',
      trainingPlan: 'basic',
      medicalHistory: 'none',
      allergies: 'none',
      medications: 'none',
      medicalConditions: 'none',
      type: UserType.ATHLETE,
    }),
    new Member({
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password',
      createdAt: new Date('2026-01-01'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      role: MemberRole.Standard,
      type: UserType.MEMBER,
    }),
  ];

  workers: Worker[] = [
    new Worker({
      type: UserType.WORKER,
      id: 10,
      name: 'Coach Mike',
      email: 'coach@club.com',
      password: 'secret',
      createdAt: new Date('2026-01-01'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      role: WorkerRole.COACH,
      salary: 50000,
      hoursToWorkPerDay: 8,
      startWorkAt: new Date('2026-01-01T09:00:00'),
      endWorkAt: new Date('2026-01-01T17:00:00'),
    }),
    new Worker({
      type: UserType.WORKER,
      id: 11,
      name: 'Admin Lisa',
      email: 'admin@club.com',
      password: 'secret',
      createdAt: new Date('2026-01-01'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      role: WorkerRole.ADMIN,
      salary: 60000,
      hoursToWorkPerDay: 8,
      startWorkAt: new Date('2026-01-01T08:00:00'),
      endWorkAt: new Date('2026-01-01T16:00:00'),
    }),
  ];

  private findById(id: number): Member | Worker | null {
    const member = this.members.find((m) => m.id === id);
    if (member) return member;
    const worker = this.workers.find((w) => w.id === id);
    if (worker) return worker;
    return null;
  }

  create(createUserDto: CreateUserDto): Member | Worker {
    const now = new Date();
    const base = {
      ...createUserDto,
      createdAt: createUserDto.createdAt ?? now,
      updatedAt: null as Date | null,
      deletedAt: null as Date | null,
      isActive: createUserDto.isActive ?? true,
    };

    if (createUserDto.type === UserType.MEMBER) {
      const id = Math.max(0, ...this.members.map((m) => m.id)) + 1;
      const member = new Member({
        ...base,
        id,
        role: (createUserDto.role as MemberRole) ?? null,   
        type: UserType.MEMBER,
      });
      this.members.push(member);
      return member;
    }

    if (createUserDto.type === UserType.ATHLETE) {
      const id = Math.max(0, ...this.members.map((m) => m.id)) + 1;
      const athlete = new Athlete({
        ...base,
        id,
        role: (createUserDto.role as MemberRole) ?? MemberRole.Standard,
        weight: createUserDto.weight ?? 0,
        height: createUserDto.height ?? 0,
        gender: createUserDto.gender ?? Gender.MALE,
        birthDate: createUserDto.birthDate ?? new Date(),
        diet: createUserDto.diet ?? '',
        trainingPlan: createUserDto.trainingPlan ?? '',
        medicalHistory: createUserDto.medicalHistory ?? '',
        allergies: createUserDto.allergies ?? '',
        medications: createUserDto.medications ?? '',
        medicalConditions: createUserDto.medicalConditions ?? '',
        type: UserType.ATHLETE,
      });
      this.members.push(athlete);
      return athlete;
    }

    if (createUserDto.type === UserType.WORKER) {
      const id = Math.max(0, ...this.workers.map((w) => w.id)) + 1;
      const worker = new Worker({
        ...base,
        id,
        role: (createUserDto.role as WorkerRole) ?? WorkerRole.ADMIN,
        salary: createUserDto.salary ?? 0,
        hoursToWorkPerDay: createUserDto.hoursToWorkPerDay ?? 0,
        startWorkAt: createUserDto.startWorkAt ?? new Date(),
        endWorkAt: createUserDto.endWorkAt ?? new Date(),
        type: UserType.WORKER,
      });
      this.workers.push(worker);
      return worker;
    }

    throw new BadRequestException('Unsupported user type');
  }

  findAll() {
    return [...this.members, ...this.workers];
  }

  findOne(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    return entity;
  }

  update(id: number, updateUserDto: UpdateUserDto): Member | Worker | Athlete {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    } 
    if (entity.type === UserType.ATHLETE || entity.type === UserType.MEMBER) {
      const member = entity as Member | Athlete;
      member.name = updateUserDto.name ?? member.name;
      member.email = updateUserDto.email ?? member.email;
      member.password = updateUserDto.password ?? member.password;
      member.createdAt = updateUserDto.createdAt ?? member.createdAt;
      member.deletedAt = updateUserDto.deletedAt ?? member.deletedAt;
      member.isActive = updateUserDto.isActive ?? member.isActive;
      member.role = (updateUserDto.role as MemberRole) ?? member.role;
      if (member.type === UserType.ATHLETE) {
        const athlete = member as Athlete;
        athlete.weight = updateUserDto.weight ?? athlete.weight;
        athlete.height = updateUserDto.height ?? athlete.height;
        athlete.gender = updateUserDto.gender ?? athlete.gender;
        athlete.birthDate = updateUserDto.birthDate ?? athlete.birthDate;
        athlete.diet = updateUserDto.diet ?? athlete.diet;
        athlete.trainingPlan = updateUserDto.trainingPlan ?? athlete.trainingPlan;
        athlete.medicalHistory = updateUserDto.medicalHistory ?? athlete.medicalHistory;
        athlete.allergies = updateUserDto.allergies ?? athlete.allergies;
        athlete.medications = updateUserDto.medications ?? athlete.medications;
        athlete.medicalConditions = updateUserDto.medicalConditions ?? athlete.medicalConditions;
      }
      member.updatedAt = new Date();
      console.log('member updated', member);
      return member;
    }

    const worker = entity as Worker;
    worker.name = updateUserDto.name ?? worker.name;
    worker.email = updateUserDto.email ?? worker.email;
    worker.password = updateUserDto.password ?? worker.password;
    worker.createdAt = updateUserDto.createdAt ?? worker.createdAt;
    worker.deletedAt = updateUserDto.deletedAt ?? worker.deletedAt;
    worker.isActive = updateUserDto.isActive ?? worker.isActive;
    worker.role = (updateUserDto.role as WorkerRole) ?? worker.role;
    worker.salary = updateUserDto.salary ?? worker.salary;
    worker.hoursToWorkPerDay =
      updateUserDto.hoursToWorkPerDay ?? worker.hoursToWorkPerDay;
    worker.startWorkAt = updateUserDto.startWorkAt ?? worker.startWorkAt;
    worker.endWorkAt = updateUserDto.endWorkAt ?? worker.endWorkAt;
    worker.updatedAt = new Date();
    return worker;
  }

  remove(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }

    this.members = this.members.filter((m) => m.id !== id);
    this.workers = this.workers.filter((w) => w.id !== id);
    console.log('members', this.members);
    console.log('workers', this.workers);
    return entity;
  }
}
