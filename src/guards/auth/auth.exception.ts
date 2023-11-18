import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token has expired');
  }
}

export class TokenNotProvidedException extends UnauthorizedException {
  constructor() {
    super('Token was not provided');
  }
}

export class TokenMalformedException extends UnauthorizedException {
  constructor() {
    super('Malformed token');
  }
}

export class UnsuficientPermissionsException extends ForbiddenException {
  constructor() {
    super('You dont have enough permissions to access this resource');
  }
}
