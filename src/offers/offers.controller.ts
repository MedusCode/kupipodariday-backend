import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateOfferDto } from './dto/createOffer.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import {
  notFoundThrower,
  violatesForeignKeyThrower,
} from '../utils/helpers/exceptionThrowers';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { WishNotExistsException } from '../exceptions/wishNotExists.exceptions';

@UseGuards(AuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('')
  create(@Body() body: CreateOfferDto, @CurrentUser() user: User) {
    return this.offersService.create(body, user).catch((err) => {
      violatesForeignKeyThrower(err, new WishNotExistsException());
      throw new ServerException();
    });
  }

  @Get('')
  getAll() {
    return this.offersService.find({});
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.offersService.findOne({ id }).catch((err) => {
      notFoundThrower(err, new NotFoundException('Оффер'));
      throw new ServerException();
    });
  }
}
