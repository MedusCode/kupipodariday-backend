import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import {
  BAD_REQUEST_MESSAGE,
  FORBIDDEN_MESSAGE,
  NOT_FOUND_MESSAGE,
} from '../utils/constants';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(creatOfferDto: CreateOfferDto, currentUser): Promise<Offer> {
    const wish = await this.wishesService.findOne(
      {
        id: creatOfferDto.itemId,
      },
      { owner: true },
    );

    if (currentUser.id === wish.owner.id) {
      throw new Error(BAD_REQUEST_MESSAGE);
    }

    if (wish.raised + creatOfferDto.amount > wish.price) {
      throw new Error(FORBIDDEN_MESSAGE);
    }

    const offerDto = {
      ...creatOfferDto,
      user: currentUser,
      item: { id: creatOfferDto.itemId },
    };

    await this.wishesService.raise(creatOfferDto.itemId, creatOfferDto.amount);

    return this.offerRepository.save(offerDto);
  }

  find(
    conditions: FindOptionsWhere<Offer>,
    relations: FindOptionsRelations<Offer> = { item: true, user: true },
  ): Promise<Array<Offer>> {
    return this.offerRepository.find({ where: conditions, relations });
  }

  async findOne(
    conditions: FindOptionsWhere<Offer>,
    relations: FindOptionsRelations<Offer> = { item: true, user: true },
  ): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: conditions,
      relations,
    });

    if (offer) {
      return offer;
    } else {
      throw new Error(NOT_FOUND_MESSAGE);
    }
  }
}
