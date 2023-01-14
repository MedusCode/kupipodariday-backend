import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { compare } from '../utils/helpers/bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { InvalidCredentialsException } from '../exceptions/invalidCredentials.exception';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async signup(res: Response, signupDto: SignupDto) {
    if (signupDto.about === '') {
      delete signupDto.about;
    }

    const userEntity = await this.userService.create(signupDto);

    delete userEntity.password;

    this.jwtService.saveToken(res, userEntity.id);

    return userEntity;
  }

  async signin(res: Response, signinDto: SigninDto) {
    let userEntity: User;
    try {
      userEntity = await this.userService.findOne({
        username: signinDto.username,
      });
    } catch (err) {
      throw new InvalidCredentialsException();
    }

    const isMatched = await compare(signinDto.password, userEntity.password);

    if (!isMatched) {
      throw new InvalidCredentialsException();
    }

    const token = this.jwtService.saveToken(res, userEntity.id);

    return { access_token: token };
  }
}
