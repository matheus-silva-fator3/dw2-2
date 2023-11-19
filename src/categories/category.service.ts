import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async doesCategoryExists(id: number) {
    return this.prisma.category.findFirst({
      where: { id },
    });
  }
}
