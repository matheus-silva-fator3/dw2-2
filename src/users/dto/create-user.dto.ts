import { ApiProperty } from '@nestjs/swagger';
import Validator from 'src/utils/Validator';

export enum UserAllowedType {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'O nome do usuário',
    example: 'Matheus André',
  })
  name: string;

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

  @ApiProperty({
    description: 'O tipo do usuário a ser criado.',
    example: 'BUYER',
    enum: UserAllowedType,
  })
  type: UserAllowedType;
}

export const CreateUserSchema = Validator.object({
  name: Validator.string(),
  email: Validator.string().email(),
  password: Validator.string().min(8),
  type: Validator.string().valid(...Object.values(UserAllowedType)),
})
  .options({ presence: 'required' })
  .required();
