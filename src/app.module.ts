import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth/auth.guard';
import { PrismaService } from './services/prisma.service';
import { AuthModule } from './guards/auth/auth.module';
import { ItemModule } from './item/item.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, AuthModule, ItemModule, AdminModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
