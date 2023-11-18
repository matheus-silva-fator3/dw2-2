import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Status, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async createUser({ password, ...CreateAdminDto }: CreateAdminDto) {
    return this.prisma.user.create({
      data: {
        ...CreateAdminDto,
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
