import { Injectable } from '@nestjs/common';
import { Category, Status } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async doesCategoryExists(id: number) {
    return this.prisma.category.findFirst({
      where: { id },
    });
  }

  async createCategory(name: string, description: string): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name,
        description,

        status: Status.ACTIVE,
      },
    });
  }

  async updateCategory(
    id: number,
    name: string,
    description: string,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
        status: Status.ACTIVE,
      },
      data: {
        name,
        description,
      },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        status: Status.ACTIVE,
      },
    });
  }

  async softDeleteCategory(id: number): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
        status: Status.ACTIVE,
      },
      data: {
        status: Status.INACTIVE,
      },
    });
  }
}
