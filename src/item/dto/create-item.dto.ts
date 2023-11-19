import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';
import { ItemTypes } from '@prisma/client';

export class CreateItemDto {
  @ApiProperty({
    description: 'O titulo do item.',
    example: 'HARRY POTTER E A PEDRA FILOSOFAL',
  })
  title: string;

  @ApiProperty({
    description: 'A descrição do item a ser vendido.',
    example:
      'Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. ',
  })
  description: string;

  @ApiProperty({
    description: 'O tipo do item a ser vendido.',
    example: 'Journal, book',
    enum: ItemTypes,
  })
  type: ItemTypes;

  @ApiProperty({
    description: 'O id do autor que criou o livro.',
    example: '1',
  })
  authorId: number;

  @ApiProperty({
    description: 'O id da categoria do livro.',
    example: '1',
  })
  categoryId: number;
}

export const CreateItemSchema = Validator.object({
  title: Validator.string(),
  description: Validator.string(),

  type: Validator.string().valid(...Object.values(ItemTypes)),

  authorId: Validator.number().positive(),
  categoryId: Validator.number().positive(),
})
  .options({ presence: 'required' })
  .required();
