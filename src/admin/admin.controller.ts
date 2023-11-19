import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Validate } from 'src/pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { HashService } from 'src/services/hash/hash.service';
import { Docs } from 'src/decorators/docs.decorator';
import { LoginDto, LoginOutput, LoginSchema } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { UserRole as RolesEnum, UserRole } from '@prisma/client';
import { Roles } from 'src/guards/auth/auth.decorator';
import { CreateAdminDto, CreateAdminSchema } from './dto/create-admin.dto';
import { ReportsOutput } from './dto/reports.dto';

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
        'Cria um usuário ADMIN, este endpoint só pode ser acessado por usuários administradores e requer autenticação.',
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
        'Login para usuários administradores, retornará um token que deve ser setado como Authorization header para as proximas requisições. O header precisa começar com "Bearer " e ser acompanhado do jwt.',
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

  @Get('reports')
  @Roles([RolesEnum.ADMIN])
  @Validate(CreateAdminSchema)
  @Docs({
    operation: {
      description:
        'Retorna um relatório de usuários do sistema, este endpoint só pode ser acessado por usuários ADMIN e necessita autenticação.',
    },
    responses: [
      {
        status: 200,
        description: 'Sucesso',
        type: ReportsOutput,
        isArray: false,
      },
    ],
  })
  async getReports(): Promise<ReportsOutput> {
    const usersByRole = {};
    let total;

    await Promise.all(
      Object.values(UserRole).map(async (role) => {
        usersByRole[role] = await this.adminService.countUsers({
          where: { role: role },
        });

        total += usersByRole[role];
      }),
    );

    return {
      users: (await this.adminService.getUsers({
        where: {
          role: undefined,
        },
        orderBy: {
          id: 'asc',
        },
      })) as any,
      usersByRole: {
        ...usersByRole,
        total,
      },
    };
  }

  private async checkUserEmailAvaliability(email: string) {
    const user = await this.adminService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('This email is already taken');
    }
  }
}
