import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto, CreateItemSchema } from './dto/create-item.dto';
import { UpdateItemDto, UpdateItemSchema } from './dto/update-item.dto';
import { ItemService } from './item.service';
import { Roles, User } from 'src/guards/auth/auth.decorator';
import { UserRole } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoryService } from 'src/categories/category.service';
import { AuthorService } from 'src/author/author.service';
import { Docs } from 'src/decorators/docs.decorator';
import { Validate } from 'src/pipes/validation.pipe';

@ApiTags('item')
@Controller('item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
  ) {}

  @Docs({
    operation: {
      description:
        'Adição de novos itens, este endpoint só pode ser utilizado por um usuário SELLER. O item criado será atribuido ao usuário que esta enviando a requisição. Esse endpoint requer autenticação.',
    },
    responses: [
      {
        status: 201,
        description: 'Item criado com sucesso.',
      },
      {
        status: 404,
        description: 'Os ids enviados não foram encontrados.',
      },
    ],
  })
  @Roles([UserRole.SELLER])
  @Validate(CreateItemSchema)
  @Post()
  async createItem(@Body() body: CreateItemDto, @User() userInfo: UserEntity) {
    await this.checkCategoryExistence(body.categoryId);
    await this.checkAuthorExistence(body.authorId);

    await this.itemService.createItem(
      body.title,
      body.description,
      userInfo.id,
      body.authorId,
      body.categoryId,
    );
  }

  @Docs({
    operation: {
      description:
        'Edição de itens, as informações que podem ser editadas são o titulo e a descrição. Apenas o usuário SELLER que criou o item pode edita-lo, caso você tente editar um que não tem acesso, receberá um erro 404. Esse endpoint requer autenticação.',
    },
    responses: [
      {
        status: 201,
        description: 'Item criado com sucesso.',
      },
      {
        status: 404,
        description:
          'O item não foi encontrado, ou você não tem permissão para modifica-lo.',
      },
    ],
  })
  @Roles([UserRole.SELLER])
  @Validate(UpdateItemSchema)
  @Put(':id')
  async updateItem(@Body() body: UpdateItemDto, @Param('id') id: string) {
    const numberId = Number(id);

    if (isNaN(numberId)) {
      throw new BadRequestException('Id needs to be a number');
    }

    await this.userHasItem(numberId);

    await this.itemService.updateItem(numberId, body.title, body.description);
  }

  @ApiOperation({
    description: 'Listagem de itens de todos não deletados.',
  })
  @Get()
  async getAllItems() {
    return this.itemService.getAllItems();
  }

  @ApiOperation({
    description:
      'Busca. A query enviada irá ser pesquisada entre o titulo e a descrição do item.',
    parameters: [{ name: 'query', in: 'query' }],
  })
  @Get('search')
  async searchItems(@Query('query') query: string) {
    return this.itemService.searchItems(query);
  }

  private async checkCategoryExistence(id: number) {
    const category = await this.categoryService.doesCategoryExists(id);

    if (!category) {
      throw new NotFoundException('This category doesnt exists.');
    }
  }

  private async checkAuthorExistence(id: number) {
    const author = await this.authorService.doesAuthorExists(id);

    if (!author) {
      throw new NotFoundException('This author doesnt exists.');
    }
  }

  private async userHasItem(userId: number, itemId: number) {
    const item = await this.itemService.userHasItem(userId, itemId);

    if (!item) {
      throw new NotFoundException('This item doesnt exists.');
    }
  }
}
