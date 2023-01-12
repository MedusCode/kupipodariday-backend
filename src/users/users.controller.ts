import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUserDto';
import {
  duplicateKeyValueThrower,
  notFoundThrower,
} from '../utils/helpers/exceptionThrowers';
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExists.exceptions';
import { WishesService } from '../wishes/wishes.service';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { SearchDto } from './dto/search.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('me')
  updateMe(@Body() body: UpdateUserDto, @CurrentUser() user: User) {
    return this.usersService.update({ id: user.id }, body).catch((err) => {
      duplicateKeyValueThrower(err, new UserAlreadyExistsException());
      throw new ServerException();
    });
  }

  @Get('me/wishes')
  getMyWishes(@CurrentUser() user: User) {
    return this.wishService.find({ owner: { id: user.id } });
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.usersService
      .findOne({ username: username })
      .catch((err) => {
        notFoundThrower(err, new NotFoundException('Пользователь'));
        throw new ServerException();
      });

    if (user) {
      delete user.email;
      return user;
    } else {
      throw new ServerException();
    }
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService
      .findOne({ username: username }, { wishes: true })
      .catch((err) => {
        notFoundThrower(err, new NotFoundException('Пользователь'));
        throw new ServerException();
      });

    return user.wishes;
  }

  //TODO: develop search
  @Post('find')
  async findByEmail(@Body() body: SearchDto) {
    return this.usersService.search(body.query);
  }
}
