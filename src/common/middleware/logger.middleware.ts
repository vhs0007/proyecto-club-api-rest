import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import type { ResponseLogMeta } from '../interceptors/http-logging.interceptor';
import { sanitizeLogBody } from '../logging/sanitize-log-body';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const started = Date.now();
    const headerId = req.headers['x-request-id'];
    const requestId =
      typeof headerId === 'string' && headerId.length > 0 ? headerId : randomUUID();
    (req as Request & { requestId?: string; responseLogMeta?: ResponseLogMeta }).requestId =
      requestId;

    const bodyPreview = sanitizeLogBody(req.body);
    const bodyPart = bodyPreview ? ` body=${bodyPreview}` : '';

    this.logger.log(`[REQUEST] ${requestId} ${req.method} ${req.originalUrl}${bodyPart}`);

    res.on('finish', () => {
      const durationMs = Date.now() - started;
      const r = req as Request & { responseLogMeta?: ResponseLogMeta };
      const meta = r.responseLogMeta;
      const routingPart = meta
        ? ` module=${meta.module} controller=${meta.controller} handler=${meta.handler}` +
          (meta.bodyPreview != null && meta.bodyPreview !== ''
            ? ` body=${meta.bodyPreview}`
            : '')
        : '';
      this.logger.log(
        `[RESPONSE] ${requestId} ${req.method} ${req.originalUrl} status=${res.statusCode} durationMs=${durationMs}${routingPart}`,
      );
    });

    next();
  }
}
