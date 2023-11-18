import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Item } from '.prisma/client';
import { Status } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(
    title: string,
    description: string,
    sellerId: number,
    authorId: number,
    categoryId: number,
  ): Promise<Item> {
    return this.prisma.item.create({
      data: {
        title,
        description,
        status: Status.ACTIVE,
        seller: {
          connect: { id: sellerId },
        },
        author: {
          connect: { id: authorId },
        },
        Category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  async updateItem(
    id: number,
    title: string,
    description: string,
  ): Promise<Item> {
    return this.prisma.item.update({
      where: {
        status: Status.ACTIVE,
        id,
      },
      data: {
        title,
        description,
      },
    });
  }

  async getAllItems(): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        status: Status.ACTIVE,
      },
    });
  }

  async searchItems(query: string): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        status: Status.ACTIVE,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
