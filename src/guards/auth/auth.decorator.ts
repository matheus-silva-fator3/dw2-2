import { Reflector } from '@nestjs/core';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole as RolesEnum } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export const Roles = Reflector.createDecorator<RolesEnum[]>();

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
