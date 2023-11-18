import { Item, UserRole } from '@prisma/client';

export class UserEntity {
  id: number;

  name: string;
  email: string;
  hashedPassword: string;
  status: string;

  role: UserRole;
  Item: Item[];
}
