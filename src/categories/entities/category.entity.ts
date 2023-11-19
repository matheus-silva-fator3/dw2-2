import { $Enums } from '@prisma/client';

export class CategoryEntity {
  id: number;
  name: string;
  description: string;
  status: $Enums.Status;
}
