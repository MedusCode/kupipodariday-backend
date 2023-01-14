import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import {
  badRequestThrower,
  notFoundThrower,
  violatesForeignKeyThrower,
} from '../utils/helpers/exceptionThrowers';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { UpdateWishDto } from './dto/updateWish.dto';
import { CopyOwnWishException } from '../exceptions/copyOwnWish.exception';
import { AlreadyOfferedException } from '../exceptions/alreadyOffered.exception';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuard)
  @Post('')
  create(@Body() body: CreateWishDto, @CurrentUser() user: User) {
    return this.wishesService.create(body, user);
  }

  @Get('last')
  getLast() {
    return this.wishesService.getLast();
  }

  @Get('top')
  getTop() {
    return this.wishesService.getTop();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: number) {
    try {
      return await this.wishesService.findOne({ id });
    } catch (err) {
      notFoundThrower(err, new NotFoundException('Подарок'));
      throw new ServerException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() body: UpdateWishDto,
    @CurrentUser() user: User,
  ) {
    const wish = await this.wishesService.checkOwner(id, user.id);

    try {
      return await this.wishesService.update({ id }, body, wish);
    } catch (err) {
      notFoundThrower(err, new NotFoundException('Подарок'));
      badRequestThrower(err, new AlreadyOfferedException());
      throw new ServerException();
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @CurrentUser() user: User) {
    const wish = await this.wishesService.checkOwner(id, user.id);

    try {
      await this.wishesService.delete({ id });
      return wish;
    } catch (err) {
      violatesForeignKeyThrower(err, new AlreadyOfferedException());
      notFoundThrower(err, new NotFoundException('Подарок'));
      throw new ServerException();
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: number, @CurrentUser() user: User) {
    try {
      return await this.wishesService.copy(id, user);
    } catch (err) {
      notFoundThrower(err, new NotFoundException('Подарок'));
      badRequestThrower(err, new CopyOwnWishException());
      throw new ServerException();
    }
  }
}
