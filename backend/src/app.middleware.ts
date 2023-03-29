import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users/services/users/users.service';
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
                this.blacklist(req.ip);
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
            req.user = user;
            next();
          } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
          }
        }
      } else {
        throw new HttpException('No token found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  encode64(text: string, numberOfTimes: number) {
    for (let i = 0; i < numberOfTimes; i++) {
      text = Buffer.from(text, 'binary').toString('base64');
    }
    return text.toString();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blacklist(ip: string) {
    return;
  }
}
