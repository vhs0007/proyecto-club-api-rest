import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Athlete, Gender } from './entities/athlete.entity';
import { MemberRole } from './entities/member.entity';
import { Worker, WorkerRole } from './entities/worker.entity';

@Injectable()
export class UsersService {
  members: Athlete[] = [
    {
      kind: 'athlete',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      createdAt: new Date('2026-01-01'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      weight: 80,
      height: 180,
      gender: Gender.MALE,
      birthDate: new Date('1990-01-01'),
      diet: 'Vegetarian',
      trainingPlan: 'Beginner',
      medicalHistory: 'None',
      allergies: 'None',
      medications: 'None',
      medicalConditions: 'None',
      role: MemberRole.ATHLETE,
    },
    {
      kind: 'athlete',
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password',
      createdAt: new Date('2026-01-02'),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
      weight: 60,
      height: 160,
      gender: Gender.FEMALE,
      birthDate: new Date('1995-05-15'),
      diet: 'Vegetarian',
      trainingPlan: 'Beginner',
      medicalHistory: 'None',
      allergies: 'None',
      medications: 'None',
      medicalConditions: 'None',
      role: MemberRole.ATHLETE,
    },
  ];

  workers: Worker[] = [
    {
      kind: 'worker',
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
    },
    {
      kind: 'worker',
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
    },
  ];

  private findById(id: number): Athlete | Worker | null {
    const member = this.members.find((m) => m.id === id);
    if (member) return member;
    const worker = this.workers.find((w) => w.id === id);
    if (worker) return worker;
    return null;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto): Athlete | Worker {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }

    // Member no tiene lista propia: Athlete extiende Member, así que athlete "es" member
    if (entity.kind === 'athlete') {
      const athlete = entity as Athlete;
      athlete.name = updateUserDto.name ?? athlete.name;
      athlete.email = updateUserDto.email ?? athlete.email;
      athlete.password = updateUserDto.password ?? athlete.password;
      athlete.createdAt = updateUserDto.createdAt ?? athlete.createdAt;
      athlete.deletedAt = updateUserDto.deletedAt ?? athlete.deletedAt;
      athlete.isActive = updateUserDto.isActive ?? athlete.isActive;
      athlete.role = (updateUserDto.role as MemberRole) ?? athlete.role;
      athlete.weight = updateUserDto.weight ?? athlete.weight;
      athlete.height = updateUserDto.height ?? athlete.height;
      athlete.gender = updateUserDto.gender ?? athlete.gender;
      athlete.birthDate = updateUserDto.birthDate ?? athlete.birthDate;
      athlete.diet = updateUserDto.diet ?? athlete.diet;
      athlete.trainingPlan = updateUserDto.trainingPlan ?? athlete.trainingPlan;
      athlete.medicalHistory =
        updateUserDto.medicalHistory ?? athlete.medicalHistory;
      athlete.allergies = updateUserDto.allergies ?? athlete.allergies;
      athlete.medications = updateUserDto.medications ?? athlete.medications;
      athlete.medicalConditions =
        updateUserDto.medicalConditions ?? athlete.medicalConditions;
      athlete.updatedAt = new Date();
      return athlete;
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
    return `This action removes a #${id} user`;
  }
}
