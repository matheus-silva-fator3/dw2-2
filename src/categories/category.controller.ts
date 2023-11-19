import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateCategorySchema,
} from './dto/create-category.dto';
import {
  UpdateCategoryDto,
  UpdateCategorySchema,
} from './dto/update-category.dto';
import { Docs } from 'src/decorators/docs.decorator';
import { Roles } from 'src/guards/auth/auth.decorator';
import { Validate } from 'src/pipes/validation.pipe';
import { transformIdIntoNumber } from 'src/utils/Params';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Docs({
    operation: {
      description: 'Lista todas as categorias não deletadas logicamente.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso',

        type: CategoryEntity,
        isArray: true,
      },
    ],
  })
  @Get()
  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoryService.getAllCategories();
  }

  @Docs({
    operation: {
      description:
        'Cria uma categoria para classificação de itens. Este endpoint só pode ser utilizado por usuários ADMIN e requer autenticação.',
    },
    responses: [
      {
        status: 201,
        description: 'Categoria criada.',
      },
    ],
  })
  @Roles(['ADMIN'])
  @Validate(CreateCategorySchema)
  @Post()
  async createCategory(
    @Body()
    body: CreateCategoryDto,
  ) {
    await this.categoryService.createCategory(body.name, body.description);
  }

  @Docs({
    operation: {
      description:
        'Atualiza uma categoria. O parametro representa o Id da categoria. A categoria precisa existir e não estar deletada logicamente. Este endpoint só pode ser utilizado por usuários ADMIN e requer autenticação.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso',
      },
      {
        status: 404,
        description: 'O id fornecido não corresponde a nenhuma categoria ativa',
      },
    ],
  })
  @Put(':id')
  @Roles(['ADMIN'])
  @Validate(UpdateCategorySchema)
  async updateCategory(
    @Body()
    body: UpdateCategoryDto,
    @Param()
    { id },
  ) {
    const idNum = transformIdIntoNumber(id);

    await this.checkCategoryExistence(idNum);
    await this.categoryService.updateCategory(
      idNum,
      body.name,
      body.description,
    );
  }

  @Docs({
    operation: {
      description:
        'Exclui logicamente uma categoria. O parametro representa o Id da categoria. A categoria precisa existir e não estar deletada logicamente. Este endpoint só pode ser utilizado por usuários ADMIN e requer autenticação.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso',
      },
      {
        status: 404,
        description: 'O id fornecido não corresponde a nenhuma categoria ativa',
      },
    ],
  })
  @Roles(['ADMIN'])
  @Delete(':id')
  async softDeleteCategory(@Param('id') id: string) {
    const idNum = transformIdIntoNumber(id);

    await this.checkCategoryExistence(idNum);
    await this.categoryService.softDeleteCategory(idNum);
  }

  private async checkCategoryExistence(id: number) {
    const category = await this.categoryService.doesCategoryExists(id);

    if (!category) {
      throw new NotFoundException('This category doesnt exists.');
    }
  }
}
