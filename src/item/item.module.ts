import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { PrismaService } from 'src/services/prisma.service';
import { HashService } from 'src/services/hash/hash.service';
import { BcryptService } from 'src/services/hash/implementations/bcrypt.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { JsonWebTokenService } from 'src/services/jwt/implementations/jsonwebtoken.service';
import { ItemController } from './Item.controller';
import { AuthorModule } from 'src/author/author.module';
import { CategoryModule } from 'src/categories/category.module';

@Module({
  controllers: [ItemController],
  imports: [CategoryModule, AuthorModule],
  providers: [
    ItemService,
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
  exports: [ItemService],
})
export class ItemModule {}
