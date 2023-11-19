import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
import { ListItem } from './dto/list-items.dto';
import { SearchQueryBuilder } from './entities/search';
import { transformIdIntoNumber } from 'src/utils/Params';

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
      body.type,
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
        status: 200,
        description: 'Item editado com sucesso.',
      },
      {
        status: 404,
        description:
          'O item não foi encontrado ou você não tem permissão para modifica-lo.',
      },
    ],
  })
  @Roles([UserRole.SELLER])
  @Validate(UpdateItemSchema)
  @Put(':id')
  async updateItem(
    @Body() body: UpdateItemDto,
    @Param('id') id: string,
    @User() userInfo: UserEntity,
  ) {
    const itemId = transformIdIntoNumber(id);
    await this.userHasItem(userInfo.id, itemId);

    await this.itemService.updateItem(itemId, body.title, body.description);
  }

  @Docs({
    operation: {
      description: 'Listagem de todos os itens não deletados logicamente.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso.',
        type: ListItem,
        isArray: true,
      },
    ],
  })
  @Get()
  async getAllItems(): Promise<ListItem[]> {
    const items = await this.itemService.getAllItems();
    return items.map((item): ListItem => new ListItem(item));
  }

  @Docs({
    operation: {
      description:
        'Uma pesquisa dos itens registrados. Os parametros para pesquisa podem ou não estar presentes, não enviar nenhum parametro irá trazer todos os items. O parametro query irá ser pesquisado entre o titulo e a descrição do item. O parametro authorId irá pesquisar itens feitos por aquele autor. O parametro categoryId irá pesquisar por itens daquela categoria. Apenas itens não deletados serão pesquisados.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso.',
        type: ListItem,
        isArray: true,
      },
    ],
  })
  @Get('search')
  async searchItems(
    @Query('query') query: string | undefined,
    @Query('categoryId') categoryId: string | undefined,
    @Query('authorId') authorId: string | undefined,
  ): Promise<ListItem[]> {
    const authorIdNumber = authorId
      ? transformIdIntoNumber(authorId)
      : undefined;

    const categoryIdNumber = categoryId
      ? transformIdIntoNumber(categoryId)
      : undefined;

    const { where } = new SearchQueryBuilder()
      .query(query)
      .author(authorIdNumber)
      .category(categoryIdNumber);

    const itens = await this.itemService.searchItems(where);

    return itens.map((item): ListItem => new ListItem(item));
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
