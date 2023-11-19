import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Prisma, Status, User, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async createUser({ password, ...CreateAdminDto }: CreateAdminDto) {
    return this.prisma.user.create({
      data: {
        ...CreateAdminDto,
        hashedPassword: password,
        status: Status.ACTIVE,
        role: UserRole.ADMIN,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email: email,
        role: UserRole.ADMIN,
      },
    });
  }

  async countUsers(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.user.count({
      where: { status: Status.ACTIVE, role: UserRole.ADMIN, ...where },
    });
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: { status: Status.ACTIVE, role: UserRole.ADMIN, ...where },
      orderBy,
    });
  }
}
