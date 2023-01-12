import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from '../users/entities/user.entity';
import { WishDto } from './dto/wish.dto';
import {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
} from '../utils/constants';
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

  create(createWishDto: CreateWishDto, owner: User) {
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
  ) {
    return this.wishRepository.find({ where: conditions, relations });
  }

  findOne(
    conditions: FindOptionsWhere<Wish>,
    relations: FindOptionsRelationByString | FindOptionsRelations<Wish> = [
      'owner',
      'offers',
      'offers.user',
    ],
  ) {
    return this.wishRepository
      .findOne({ where: conditions, relations })
      .then((wish) => {
        if (wish) {
          return wish;
        } else {
          throw new Error(NOT_FOUND_ERROR_MESSAGE);
        }
      });
  }

  async update(
    conditions: FindOptionsWhere<Wish>,
    updateDto: UpdateWishDto,
    wish: Wish,
  ) {
    if (wish.offers.length > 0) {
      throw new Error(BAD_REQUEST_MESSAGE);
    }

    return this.wishRepository.update(conditions, updateDto).then((result) => {
      if (result.affected > 0) {
        return this.findOne(conditions);
      } else {
        throw new Error(NOT_FOUND_ERROR_MESSAGE);
      }
    });
  }

  delete(conditions: FindOptionsWhere<Wish>) {
    return this.wishRepository.delete(conditions);
  }

  async checkOwner(wishId, ownerId) {
    const wish = await this.findOne({ id: wishId }).catch((err) => {
      notFoundThrower(err, new NotFoundException('Подарок'));
      throw new ServerException();
    });

    if (ownerId !== wish.owner.id) {
      throw new ForbiddenException();
    } else {
      return wish;
    }
  }

  async copy(id: number, currentUser: User) {
    return await this.findOne({ id: id }).then((wish) => {
      if (wish && wish.owner.id !== currentUser.id) {
        const createWishDto: CreateWishDto = {
          name: wish.name,
          link: wish.link,
          image: wish.image,
          price: wish.price,
          description: wish.description,
        };
        this.wishRepository.update(
          { id: wish.id },
          { copied: wish.copied + 1 },
        );
        return this.create(createWishDto, currentUser);
      }
      if (wish) {
        throw new Error(BAD_REQUEST_MESSAGE);
      }
      throw new Error(NOT_FOUND_ERROR_MESSAGE);
    });
  }

  getLast() {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: { offers: true, owner: true },
    });
  }

  getTop() {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: { owner: true, offers: true },
    });
  }

  async raise(id, sum) {
    return await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .where({ id })
      .set({ raised: () => `raised + ${sum}` })
      .execute();
  }
}
