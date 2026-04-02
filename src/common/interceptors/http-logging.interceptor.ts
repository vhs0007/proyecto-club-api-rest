import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { sanitizeLogBody } from '../logging/sanitize-log-body';

export type ResponseLogMeta = {
  module: string;
  controller: string;
  handler: string;
  bodyPreview?: string;
};

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { responseLogMeta?: ResponseLogMeta }>();

    return next.handle().pipe(
      tap((data: unknown) => {
        const controller = context.getClass().name;
        const handler = context.getHandler().name;
        const moduleName = controller.endsWith('Controller')
          ? `${controller.slice(0, -'Controller'.length)}Module`
          : `${controller}Module`;

        req.responseLogMeta = {
          module: moduleName,
          controller,
          handler,
          bodyPreview: sanitizeLogBody(data),
        };
      }),
    );
  }
}
