import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  Put,
  BadRequestException,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { Validate } from 'src/pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { HashService } from 'src/services/hash/hash.service';
import { Docs } from 'src/decorators/docs.decorator';
import { LoginDto, LoginOutput, LoginSchema } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { Roles } from 'src/guards/auth/auth.decorator';
import { transformIdIntoNumber } from 'src/utils/Params';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';

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
      description: 'Cria um usuário do tipo fornecido.',
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
        'Login para usuários comuns, retornará um token que deve ser setado como Authorization header para as proximas requisições. O header precisa começar com "Bearer " e ser acompanhado do jwt.',
    },
    responses: [
      {
        status: 201,
        description: 'Seção criada',
        type: LoginOutput,
        isArray: false,
      },
      {
        status: 401,
        description: 'Login invalido',
      },
    ],
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginOutput> {
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

  @Docs({
    operation: {
      description:
        'Altera o nome ou senha de um usuario cujo id foi passado como parametro na requisição, requer autenticação para seu uso.',
    },
    responses: [
      {
        status: 200,
        description: 'Usuário editado',
      },
      {
        status: 404,
        description: 'Usuário não existe ou foi deletado logicamente',
      },
    ],
  })
  @Put(':id')
  @Validate(UpdateUserSchema)
  @Roles(['ADMIN'])
  async updateUser(
    @Body()
    body: UpdateUserDto,
    @Param()
    { id },
  ) {
    const idNum = transformIdIntoNumber(id);

    await this.checkUserExistence(idNum);

    const hashedPassword = body.password
      ? await this.hashService.hash(body.password)
      : undefined;

    await this.usersService.updateUser(idNum, body.name, hashedPassword);
  }

  @Docs({
    operation: {
      description:
        'Deleta um usuario cujo id foi passado como parametro na requisição, requer autenticação para seu uso.',
    },
    responses: [
      {
        status: 200,
        description: 'Usuário deletado',
      },
      {
        status: 404,
        description: 'Usuário não existe ou foi deletado logicamente',
      },
    ],
  })
  @Delete(':id')
  @Roles(['ADMIN'])
  async deleteUser(
    @Param()
    { id },
  ) {
    const idNum = transformIdIntoNumber(id);
    await this.checkUserExistence(idNum);

    await this.usersService.deleteUser(idNum);
  }

  private async checkUserEmailAvaliability(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('This email is already taken');
    }
  }

  private async checkUserExistence(userId: number) {
    const item = await this.usersService.getUserById(userId);

    if (!item) {
      throw new NotFoundException('This user doesnt exists.');
    }
  }
}
