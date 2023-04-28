import { UserService } from './../user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IExpressRequestUser } from '../user.type';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IExpressRequestUser, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization;
    try {
      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.userService.findById(decode['id']);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
