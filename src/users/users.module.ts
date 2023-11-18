import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma.service';
import { HashService } from 'src/services/hash/hash.service';
import { BcryptService } from 'src/services/hash/implementations/bcrypt.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { JsonWebTokenService } from 'src/services/jwt/implementations/jsonwebtoken.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: HashService,
      useClass: BcryptService,
    },
    {
      provide: JWTService,
      useClass: JsonWebTokenService,
    },
  ],
})
export class UsersModule {}
