import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminOnly = createParamDecorator(
  (target: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user && user.isAdmin === true;
  },
);
