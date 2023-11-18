import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Validate } from 'src/pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { HashService } from 'src/services/hash/hash.service';
import { Docs } from 'src/decorators/docs.decorator';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { UserRole as RolesEnum } from '@prisma/client';
import { Roles } from 'src/guards/auth/auth.decorator';
import { CreateAdminDto, CreateAdminSchema } from './dto/create-admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  @Post()
  @Roles([RolesEnum.ADMIN])
  @Validate(CreateAdminSchema)
  @Docs({
    operation: {
      description:
        'Cria um usuário ADMIN se o email enviado for válido, este endpoint só pode ser acessado por usuários administradores..',
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
  async createUser(@Body() CreateAdminDto: CreateAdminDto): Promise<void> {
    await this.checkUserEmailAvaliability(CreateAdminDto.email);
    const hashedPassword = await this.hashService.hash(CreateAdminDto.password);

    await this.adminService.createUser({
      ...CreateAdminDto,
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
    const user = await this.adminService.getUserByEmail(loginDto.email);
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

  private async checkUserEmailAvaliability(email: string) {
    const user = await this.adminService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('This email is already taken');
    }
  }
}
