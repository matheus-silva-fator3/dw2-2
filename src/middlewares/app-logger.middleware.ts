import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path: url } = request;

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(
        `\nNew ${method} request at ${url} ended with a response code ${statusCode}\nBody: ${JSON.stringify(
          request.body,
        )}\nParams: ${JSON.stringify(request.params)}`,
      );
    });

    next();
  }
}
