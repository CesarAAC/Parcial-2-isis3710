import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
        `Status: ${statusCode} Duration: ${duration}ms`
      );
    });

    next();
  }
}