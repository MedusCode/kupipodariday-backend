import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { WishlistDto } from './dto/wishlist.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { NOT_FOUND_MESSAGE } from '../utils/constants';
import { notFoundThrower } from '../utils/helpers/exceptionThrowers';
import { NotFoundException } from '../exceptions/notFound.exception';
import { ServerException } from '../exceptions/server.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  find(
    conditions: FindOptionsWhere<Wishlist>,
    relations: FindOptionsRelations<Wishlist> = { owner: true, items: true },
  ): Promise<Array<Wishlist>> {
    return this.wishlistRepository.find({
      where: conditions,
      relations: relations,
    });
  }

  async findOne(
    conditions: FindOptionsWhere<Wishlist>,
    relations: FindOptionsRelations<Wishlist> = { owner: true, items: true },
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: conditions,
      relations: relations,
    });

    if (!wishlist) {
      throw new Error(NOT_FOUND_MESSAGE);
    } else {
      return wishlist;
    }
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    currentUser: User,
  ): Promise<Wishlist> {
    const items = createWishlistDto.itemsId.map((id) => ({ id } as Wish));
    delete createWishlistDto.itemsId;

    const wishlistsDto: WishlistDto = {
      ...createWishlistDto,
      owner: currentUser,
      items,
    };

    const wishlist = await this.wishlistRepository.save(wishlistsDto);
    return this.findOne({ id: wishlist.id });
  }

  async checkOwner(wishlistId, ownerId): Promise<Wishlist> {
    let wishlist: Wishlist;
    try {
      wishlist = await this.findOne({ id: wishlistId });
    } catch (err) {
      notFoundThrower(err, new NotFoundException('Список подарков'));
      throw new ServerException();
    }

    if (ownerId !== wishlist.owner.id) {
      throw new ForbiddenException();
    } else {
      return wishlist;
    }
  }

  delete(conditions: FindOptionsWhere<Wishlist>): Promise<DeleteResult> {
    return this.wishlistRepository.delete(conditions);
  }

  async update(
    updateDto: UpdateWishlistDto,
    wishlist: Wishlist,
  ): Promise<Wishlist> {
    let items: Array<Wish> = wishlist.items;
    if (updateDto.itemsId) {
      items = updateDto.itemsId.map((id) => ({ id } as Wish));
      delete updateDto.itemsId;
    }

    await this.wishlistRepository.save({
      id: wishlist.id,
      items,
      ...updateDto,
    });
    return this.findOne({ id: wishlist.id });
  }
}
