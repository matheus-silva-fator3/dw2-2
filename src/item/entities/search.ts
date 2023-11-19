import { Prisma } from '@prisma/client';

export class SearchQueryBuilder {
  where: Prisma.ItemWhereInput = {};

  query(query: string | undefined) {
    if (query) {
      this.where['OR'] = [
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
      ];
    }

    return this;
  }

  category(categoryId: number) {
    if (categoryId) {
      this.where['Category'] = {
        id: categoryId,
      };
    }

    return this;
  }

  author(authorId: number) {
    if (authorId) {
      this.where['author'] = {
        id: authorId,
      };
    }

    return this;
  }
}
