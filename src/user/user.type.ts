import { UserEntity } from './entities/user.entity';
import { Request } from 'express';

export interface IUserRequest extends Omit<UserEntity, 'hashPassword'> {
  token: string;
}
export interface IExpressRequestUser extends Request {
  user?: UserEntity;
}
