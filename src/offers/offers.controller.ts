import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateOfferDto } from './dto/createOffer.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import {
  badRequestThrower,
  forbiddenThrower,
  notFoundThrower,
  violatesForeignKeyThrower,
} from '../utils/helpers/exceptionThrowers';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { WishNotExistsException } from '../exceptions/wishNotExists.exception';
import { OfferOwnWishException } from '../exceptions/offerOwnWish.exceptions';
import { ToBigOfferException } from '../exceptions/tooBigOffer.exception';

@UseGuards(AuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('')
  async create(@Body() body: CreateOfferDto, @CurrentUser() user: User) {
    try {
      return await this.offersService.create(body, user);
    } catch (err) {
      badRequestThrower(err, new OfferOwnWishException());
      forbiddenThrower(err, new ToBigOfferException());
      violatesForeignKeyThrower(err, new WishNotExistsException());
      throw new ServerException();
    }
  }

  @Get('')
  getAll() {
    return this.offersService.find({});
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    try {
      return await this.offersService.findOne({ id });
    } catch (err) {
      //Функция notFoundThrower проверяет тип ошибки
      notFoundThrower(err, new NotFoundException('Оффер'));
      //Замыкающая ошибка, срабатывает, если другие ошибки не сработали
      //Без нее nest возращает пустой ответ, так как отработал блок catch
      throw new ServerException();
    }
  }
}
