import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from '../users/entities/user.entity';
import { WishDto } from './dto/wish.dto';
import { BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE } from '../utils/constants';
import { UpdateWishDto } from './dto/updateWish.dto';
import { notFoundThrower } from '../utils/helpers/exceptionThrowers';
import { ServerException } from '../exceptions/server.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { NotFoundException } from '../exceptions/notFound.exception';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wishDto: WishDto = { ...createWishDto, owner, copied: 0, raised: 0 };

    return this.wishRepository.save(wishDto);
  }

  find(
    conditions: FindOptionsWhere<Wish>,
    relations: FindOptionsRelationByString | FindOptionsRelations<Wish> = [
      'owner',
      'offers',
      'offers.user',
    ],
  ): Promise<Array<Wish>> {
    return this.wishRepository.find({ where: conditions, relations });
  }

  async findOne(
    conditions: FindOptionsWhere<Wish>,
    relations: FindOptionsRelationByString | FindOptionsRelations<Wish> = [
      'owner',
      'offers',
      'offers.user',
    ],
  ): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: conditions,
      relations,
    });

    if (wish) {
      return wish;
    } else {
      throw new Error(NOT_FOUND_MESSAGE);
    }
  }

  async update(
    conditions: FindOptionsWhere<Wish>,
    updateDto: UpdateWishDto,
    wish: Wish,
  ): Promise<Wish> {
    if (wish.offers.length > 0) {
      throw new Error(BAD_REQUEST_MESSAGE);
    }

    const updateResult = await this.wishRepository.update(
      conditions,
      updateDto,
    );

    if (updateResult.affected > 0) {
      return await this.findOne(conditions);
    } else {
      throw new Error(NOT_FOUND_MESSAGE);
    }
  }

  delete(conditions: FindOptionsWhere<Wish>): Promise<DeleteResult> {
    return this.wishRepository.delete(conditions);
  }

  async checkOwner(wishId, ownerId): Promise<Wish> {
    let wish: Wish;

    try {
      wish = await this.findOne({ id: wishId });
    } catch (err) {
      notFoundThrower(err, new NotFoundException('Подарок'));
      throw new ServerException();
    }

    if (ownerId !== wish.owner.id) {
      throw new ForbiddenException();
    } else {
      return wish;
    }
  }

  async copy(id: number, currentUser: User): Promise<Wish> {
    const wish = await this.findOne({ id: id });

    if (wish && wish.owner.id !== currentUser.id) {
      const createWishDto: CreateWishDto = {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      };

      await this.wishRepository.update(
        { id: wish.id },
        { copied: wish.copied + 1 },
      );
      return this.create(createWishDto, currentUser);
    }
    if (wish) {
      throw new Error(BAD_REQUEST_MESSAGE);
    }
    throw new Error(NOT_FOUND_MESSAGE);
  }

  getLast(): Promise<Array<Wish>> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: { offers: true, owner: true },
    });
  }

  getTop(): Promise<Array<Wish>> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: { owner: true, offers: true },
    });
  }

  async raise(id, sum): Promise<UpdateResult> {
    return await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .where({ id })
      .set({ raised: () => `raised + ${sum}` })
      .execute();
  }
}
