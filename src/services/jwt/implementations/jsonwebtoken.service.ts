import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JWTService,
  Payload,
  TokenType,
  TokenTypeIdentifier,
} from '../jwt.service';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JsonWebTokenService implements JWTService, OnModuleInit {
  private readonly secret = process.env.JWT_SECRET;
  private readonly options: Partial<jwt.SignOptions> = {
    algorithm: 'HS256',
    audience: 'sepo.api',
    issuer: 'https://sepo.api',
  };

  async onModuleInit() {
    if (!this.secret) {
      throw Error('No secret set for JWT Service');
    }
  }

  sign<type extends TokenType>(payload: any, tokenType: type): string {
    const typ: Record<TokenType, TokenTypeIdentifier> = {
      AccessToken: TokenTypeIdentifier.AccessToken,
    };

    return jwt.sign(payload, this.secret, {
      ...this.options,
      expiresIn: 3600,
      jwtid: uuid(),
      header: {
        alg: 'HS256',
        typ: typ[tokenType],
      },
    });
  }

  verify<Type extends TokenType>(
    token: string,
    tokenType: TokenType,
  ): Payload[Type] {
    try {
      const result = jwt.verify(token, this.secret, {
        audience: this.options.audience,
        issuer: this.options.issuer,
      });

      const tokenHeader = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString(),
      );

      if (tokenHeader.typ !== TokenTypeIdentifier[tokenType]) {
        throw new Error();
      }

      return result as Payload[Type];
    } catch (error) {
      const errors: Record<string, string> = {
        [jwt.TokenExpiredError.name]: 'Your authorization token has expired',
        [jwt.JsonWebTokenError.name]: 'Your token is invalid',
      };

      throw new UnauthorizedException(errors[error.name] ?? error);
    }
  }
}
