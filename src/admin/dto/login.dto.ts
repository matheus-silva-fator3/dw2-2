import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';

export class LoginDto {
  @ApiProperty({
    description: 'Um email válido.',
    example: 'email@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Uma senha de tamanho maior que 8 carácteres.',
    minLength: 8,
    example: 'senhaforte123',
  })
  password: string;
}

export const LoginSchema = Validator.object({
  email: Validator.string().email(),
  password: Validator.string().min(8),
})
  .options({ presence: 'required' })
  .required();
