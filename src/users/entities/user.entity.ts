import { $Enums } from '@prisma/client';

export class UserEntity {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
  status: $Enums.Status;
  role: $Enums.UserRole;
}
