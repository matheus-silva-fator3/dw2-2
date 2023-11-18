import { Reflector } from '@nestjs/core';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Roles as RolesEnum } from '@prisma/client';

export const Roles = Reflector.createDecorator<RolesEnum[]>();

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
