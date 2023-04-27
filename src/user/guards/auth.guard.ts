import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IExpressRequestUser } from '../user.type';

@Injectable()
export class AuthGuards implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<IExpressRequestUser>();
    if (req.user) return true;
    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
