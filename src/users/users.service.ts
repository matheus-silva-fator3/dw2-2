import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser({ password, type, ...createUserDto }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        hashedPassword: password,
        status: Status.ACTIVE,
        role: type,
      },
    });
  }

  async getUserById(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async updateUser(
    id: number,
    name: string | undefined,
    hashedPassword: string | undefined,
  ) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        hashedPassword,
      },
    });
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: Status.INACTIVE,
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
