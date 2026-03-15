import { ApiProperty } from '@nestjs/swagger';
import type { UserNavigation } from 'src/expiration/repository/expiration.repository';
import type { MembershipNavigation } from 'src/expiration/repository/expiration.repository';

export class ExpirationResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la expiración' })
  id: number;
  
  @ApiProperty({ example: { id: 1, name: 'Juan Pérez', typeId: 1, email: 'juan.perez@example.com', password: '123456', createdAt: '2026-01-01', deletedAt: null, isActive: true }, description: 'Miembro' })
  member: UserNavigation;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de expiración' })
  expirationDate: Date;

  @ApiProperty({ example: 'Membership', description: 'Membresía' })
  membership: MembershipNavigation;
}
