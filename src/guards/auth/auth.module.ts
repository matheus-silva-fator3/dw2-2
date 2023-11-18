import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { JsonWebTokenService } from 'src/services/jwt/implementations/jsonwebtoken.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [],
  providers: [
    AuthGuard,
    {
      provide: JWTService,
      useClass: JsonWebTokenService,
    },
    PrismaService,
  ],
  exports: [
    AuthGuard,
    {
      provide: JWTService,
      useClass: JsonWebTokenService,
    },
  ],
})
export class AuthModule {}
