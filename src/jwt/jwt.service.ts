import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

interface IJwtToken {
  key: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;
  private readonly jwtLifespanInDays: number;

  constructor(private configService: ConfigService) {
    this.jwtSecret = this.configService.get('jwt.secret');
    this.jwtLifespanInDays = this.configService.get('jwt.lifespan_in_days');
  }

  private generateToken(values: Record<string, unknown>) {
    if (this.jwtSecret) {
      return jwt.sign(values, this.jwtSecret, {
        expiresIn: `${this.jwtLifespanInDays}d`,
      });
    }
    throw new Error('Generate token error. Lack of jwt secret');
  }

  private verifyData(data: unknown, key: string): asserts data is IJwtToken {
    if (!(data instanceof Object))
      throw new Error('Decoded token error. Token must be an object');
    if (!(key in data))
      throw new Error(`Decoded token error. Missing required field ${key}`);
  }

  verifyToken(token: string) {
    const data = jwt.verify(token, this.jwtSecret);
    this.verifyData(data, 'id');
    return data;
  }

  saveToken(res: Response, id) {
    const token = this.generateToken({ id });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * this.jwtLifespanInDays,
      httpOnly: true,
    });

    return token;
  }
}
