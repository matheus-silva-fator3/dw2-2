import { Status } from '@prisma/client';
import { ItemWithDetails } from '../item.service';
import { ApiProperty } from '@nestjs/swagger';

export class ListItem {
  constructor(item: ItemWithDetails) {
    this.id = item.id;
    this.title = item.title;
    this.description = item.description;
    this.status = item.status;
    this.authorName = item.author.nome;
    this.sellerName = item.seller.name;
    this.categories = [item.Category.name];
  }

  id: number;

  title: string;
  description: string;
  @ApiProperty({
    enum: Status,
  })
  status: Status;

  authorName: string;
  sellerName: string;
  categories: string[];
}
