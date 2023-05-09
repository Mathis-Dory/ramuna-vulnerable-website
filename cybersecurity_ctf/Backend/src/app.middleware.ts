import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users/services/users/users.service';
import { User } from './typeorm';
import { UserStatus } from './users/user.enums';
interface UserRequest extends Request {
  user: any;
}
@Injectable()
export class isAuthenticated implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        const token = req.headers.authorization.split(' ')[1];
        let decoded, newToken;
        try {
          decoded = await this.jwt.verify(token);
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            const decodedNoCheck = this.jwt.decode(token);
            const user = await this.userService.findUsersByEmail(
              decodedNoCheck['email'],
            );
            if (user) {
              if (user.token === token) {
                newToken = this.jwt.sign(
                  { email: user.email },
                  { secret: process.env.JWT_SECRET, expiresIn: '3h' },
                );
                await this.userService.updateToken(newToken, user);
              } else {
                await this.blacklist(req.ip, user);
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
              }
            }
          } else {
            throw err;
          }
        }
        if (newToken) {
          req.headers.authorization = `Bearer ${newToken}`;
          res.setHeader('exchangeToken', this.encode64(newToken, 18));
          next();
        } else {
          decoded = await this.jwt.verify(token);
          const user = await this.userService.findUsersByEmail(decoded.email);
          if (user) {
            if (user.status === UserStatus.BANNED) {
              throw new HttpException('Banned', HttpStatus.FORBIDDEN);
            }
            req.user = user;
            next();
          } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
          }
        }
      } else {
        throw new HttpException('No token found', HttpStatus.NOT_FOUND);
      }
    } catch (err) {
      throw err;
    }
  }

  encode64(text: string, numberOfTimes: number) {
    for (let i = 0; i < numberOfTimes; i++) {
      text = Buffer.from(text, 'binary').toString('base64');
    }
    return text.toString();
  }

  async blacklist(ip: string, user: User) {
    await this.userService.updateUserStatus(UserStatus.BANNED, user);
    //blacklist Ip logic here
    return;
  }
}
