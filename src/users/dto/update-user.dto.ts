import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'O nome do usuário',
    example: 'Matheus André',
  })
  name: string;

  @ApiProperty({
    description: 'Uma senha de tamanho maior que 8 carácteres.',
    minLength: 8,
    example: 'senhaforte123',
  })
  password: string;
}

export const UpdateUserSchema = Validator.object({
  name: Validator.string().optional(),
  password: Validator.string().min(8).optional(),
})
  .options({ presence: 'required' })
  .required();
