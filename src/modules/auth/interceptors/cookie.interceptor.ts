import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Interceptor to update refresh and access token in cookies */
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        const { accessToken, refreshToken } = data;

        /** Update access token */
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60, // 1 hour
        });
        /** Update refresh token */
        if (refreshToken)
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          });

        /** Return access token in response(mostly used for easier testing) */
        return { accessToken };
      }),
    );
  }
}
