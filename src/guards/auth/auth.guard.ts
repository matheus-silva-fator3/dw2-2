import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/guards/auth/auth.decorator';

import {
  TokenExpiredException,
  TokenMalformedException,
  TokenNotProvidedException,
  UnsuficientPermissionsException,
} from 'src/guards/auth/auth.exception';
import { Roles as RoleEnum } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const {
      headers: { authorization },
    } = context.getArgs()[0];

    if (!authorization) {
      throw new TokenNotProvidedException();
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new TokenMalformedException();
    }

    const [, token] = authorization.split(' ');
    const result = this.jwtService.verify<TokenType.AccessToken>(
      token,
      TokenType.AccessToken,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        AND: [{ userId: Number(result.sub) }, { deletedAt: null }],
      },
    });

    if (user === null) {
      throw new TokenExpiredException();
    }

    if (!this.userHasPerms(roles, user.role)) {
      throw new UnsuficientPermissionsException();
    }

    this.setUserIdInRequestObject(context, user);
    return true;
  }

  private userHasPerms(permitedRoles: RoleEnum[], userRole: RoleEnum) {
    return permitedRoles.includes(userRole);
  }

  private setUserIdInRequestObject(
    context: ExecutionContext,
    user: UserEntity,
  ) {
    const request = context.switchToHttp().getRequest();
    request.user = user;
  }
}
