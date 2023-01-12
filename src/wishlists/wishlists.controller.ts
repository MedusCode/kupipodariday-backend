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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  notFoundThrower,
  violatesForeignKeyThrower,
} from '../utils/helpers/exceptionThrowers';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { WishNotExistsException } from '../exceptions/wishNotExists.exceptions';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post('')
  create(@Body() body: CreateWishlistDto, @CurrentUser() user: User) {
    return this.wishlistsService.create(body, user).catch((err) => {
      violatesForeignKeyThrower(err, new WishNotExistsException());
      throw new ServerException();
    });
  }

  @Get('')
  getAll() {
    return this.wishlistsService.find({});
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.wishlistsService.findOne({ id }).catch((err) => {
      notFoundThrower(err, new NotFoundException('Список подарков'));
      throw new ServerException();
    });
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number, @CurrentUser() user: User) {
    const wishlist = await this.wishlistsService.checkOwner(id, user.id);

    this.wishlistsService.delete({ id }).catch((err) => {
      notFoundThrower(err, new NotFoundException('Список подарков'));
      throw new ServerException();
    });

    return wishlist;
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() body: UpdateWishlistDto,
    @CurrentUser() user: User,
  ) {
    const wishlist = await this.wishlistsService.checkOwner(id, user.id);

    return this.wishlistsService.update(body, wishlist).catch((err) => {
      notFoundThrower(err, new NotFoundException('Список подароков'));
      violatesForeignKeyThrower(err, new WishNotExistsException());
      throw new ServerException();
    });
  }
}
