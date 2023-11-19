import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Item } from '.prisma/client';
import { Status, ItemTypes, Prisma } from '@prisma/client';

export type ItemWithDetails = {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: Date;
  author: {
    nome: string;
  };
  seller: {
    name: string;
  };
  Category: {
    name: string;
  };
  authorId: number;
  sellerId: number;
  categoryId: number;
};

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(
    title: string,
    description: string,
    type: ItemTypes,
    sellerId: number,
    authorId: number,
    categoryId: number,
  ): Promise<Item> {
    return this.prisma.item.create({
      data: {
        title,
        description,
        type,
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

  async userHasItem(userId: number, itemId: number) {
    return this.prisma.item.findFirst({
      where: {
        id: itemId,
        sellerId: userId,
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

  async getAllItems(): Promise<ItemWithDetails[]> {
    return this.prisma.item.findMany({
      where: {
        status: Status.ACTIVE,
      },
      select: {
        authorId: true,
        categoryId: true,
        description: true,
        sellerId: true,
        status: true,
        title: true,
        id: true,
        createdAt: true,
        author: {
          select: {
            nome: true,
          },
        },
        seller: {
          select: {
            name: true,
          },
        },
        Category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async searchItems(where: Prisma.ItemWhereInput): Promise<ItemWithDetails[]> {
    return this.prisma.item.findMany({
      where: {
        ...where,
        status: Status.ACTIVE,
      },
      select: {
        authorId: true,
        categoryId: true,
        description: true,
        sellerId: true,
        status: true,
        title: true,
        id: true,
        createdAt: true,
        author: {
          select: {
            nome: true,
          },
        },
        seller: {
          select: {
            name: true,
          },
        },
        Category: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
