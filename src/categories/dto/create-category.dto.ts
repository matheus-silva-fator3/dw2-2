import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'O nome da categoria',
    example: 'Drama',
  })
  name: string;

  @ApiProperty({
    description: 'A descrição',
    example: 'Um gênero emocionante com reviravoltas inesperadas.',
  })
  description: string;
}

export const CreateCategorySchema = Validator.object({
  name: Validator.string(),
  description: Validator.string(),
})
  .options({ presence: 'required' })
  .required();
