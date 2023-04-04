import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Decorator to extract refresh token from cookies */
export const refreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.refreshToken;
  },
);
