import { ApiProperty } from '@nestjs/swagger';
import { Status, User, UserRole } from '@prisma/client';

class UserClass {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
  @ApiProperty({ enum: Object.values(Status) })
  status: Status;
  @ApiProperty({ enum: Object.values(UserRole) })
  role: UserRole;
}

export class ReportsOutput {
  @ApiProperty({ type: () => [UserClass] })
  users: User;

  usersByRole: Record<UserRole & 'total', number>;
}
