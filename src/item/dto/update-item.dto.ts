import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'O titulo do item.',
    example: 'HARRY POTTER E A PEDRA FILOSOFAL',
  })
  title: string | undefined;

  @ApiProperty({
    description: 'A descrição do item a ser vendido.',
    example:
      'Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. ',
  })
  description: string | undefined;
}

export const UpdateItemSchema = Validator.object({
  title: Validator.string().optional(),
  description: Validator.string().optional(),
})
  .options({ presence: 'required' })
  .required();
