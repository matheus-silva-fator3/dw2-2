import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { Validate } from 'src/pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { HashService } from 'src/services/hash/hash.service';
import { Docs } from 'src/decorators/docs.decorator';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { UserRole as RolesEnum } from '@prisma/client';
import { Roles } from 'src/guards/auth/auth.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  @Post()
  @Validate(CreateUserSchema)
  @Docs({
    operation: {
      description: 'Cria um usuário BUYER se o email enviado for válido.',
    },
    responses: [
      {
        status: 201,
        description: 'Conta criada',
      },
      {
        status: 409,
        description: 'Email em uso',
      },
    ],
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.checkUserEmailAvaliability(createUserDto.email);
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Post('login')
  @Validate(LoginSchema)
  @Docs({
    operation: {
      description:
        'Realiza um login de usuário retornando um token que deve ser utilizado como Bearer em requisições que requeiram autenticação.',
    },
    responses: [
      {
        status: 201,
        description: 'Seção criada',
      },
      {
        status: 401,
        description: 'Login invalido',
      },
    ],
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const passwordMatch = await this.hashService.compare(
      loginDto.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new UnauthorizedException('Wrong credentials');

    return {
      accessToken: this.jwtService.sign<TokenType.AccessToken>(
        { sub: user.id },
        TokenType.AccessToken,
      ),
    };
  }

  @Get('admin')
  @Roles([RolesEnum.ADMIN])
  @Docs({
    operation: {
      description: 'Retorna um Hello World para admnistradores',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso!',
      },
    ],
  })
  helloAuthenticatedAdmin() {
    return 'Hello World!';
  }

  private async checkUserEmailAvaliability(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('This email is already taken');
    }
  }
}
