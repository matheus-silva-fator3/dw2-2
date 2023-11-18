export enum TokenType {
  AccessToken = 'AccessToken',
}

export enum TokenTypeIdentifier {
  AccessToken = 'at+jwt',
}

export type AccessTokenPayload = {
  sub: string;
};

export type Payload = {
  [TokenType.AccessToken]: AccessTokenPayload;
};

export abstract class JWTService {
  abstract sign<type extends TokenType>(payload, tokenType: type): string;
  abstract verify<type extends TokenType>(
    token,
    tokenType: type,
  ): Payload[type];
}
