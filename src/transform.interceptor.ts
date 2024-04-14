import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map(data => instanceToPlain(data)));
  }
}