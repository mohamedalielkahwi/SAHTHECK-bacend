import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const { method } = req;
    const url = req.originalUrl; // 👈 change from req.url to req.originalUrl

    console.log(`[${new Date().toISOString()}] → ${method} ${url}`);

    res.on('finish', () => {
      const duration = Date.now() - now;
      const statusCode = res.statusCode;

      if (statusCode >= 400) {
        console.error(
          `[${new Date().toISOString()}] ✗ ${method} ${url} ${statusCode} - ${duration}ms`,
        );
      } else {
        console.log(
          `[${new Date().toISOString()}] ✓ ${method} ${url} ${statusCode} - ${duration}ms`,
        );
      }
    });

    next();
  }
}
