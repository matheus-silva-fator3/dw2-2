import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Status, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser({ password, ...createUserDto }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        hashedPassword: password,
        status: Status.ACTIVE,
        role: UserRole.BUYER,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
