import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';
import { Roles } from 'src/guards/auth/auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('item')
@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @ApiOperation({
    description: 'Adição de novos itens.',
  })
  @Roles([UserRole.SELLER])
  @Post()
  async createItem(@Body() body: CreateItemDto) {
    await this.itemService.createItem(
      body.title,
      body.description,
      body.sellerId,
      body.authorId,
      body.categoryId,
    );
  }

  @ApiOperation({
    description:
      'Edição de itens, as informações que podem ser editadas são o titulo e a descrição.',
    parameters: [
      { name: 'id', in: 'path' },
      { name: 'authorization', in: 'header' },
    ],
  })
  @UseInterceptors(AuthInterceptor)
  @Put(':id')
  async updateItem(@Body() body: UpdateItemDto, @Param('id') id: string) {
    await this.itemService.updateItem(Number(id), body.title, body.description);
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
}
