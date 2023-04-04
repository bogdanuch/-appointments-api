import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Set refreshToken and accessToken to cookie */
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        const { accessToken, refreshToken } = data;

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60, // 1 hour
        });
        if (refreshToken)
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          });

        return { accessToken };
      }),
    );
  }
}
