import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}
  async doesAuthorExists(id: number) {
    return this.prisma.author.findFirst({
      where: { id },
    });
  }
}
