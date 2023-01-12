import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(creatOfferDto: CreateOfferDto, currentUser) {
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
  ) {
    return this.offerRepository.find({ where: conditions, relations });
  }

  findOne(
    conditions: FindOptionsWhere<Offer>,
    relations: FindOptionsRelations<Offer> = { item: true, user: true },
  ) {
    return this.offerRepository
      .findOne({ where: conditions, relations })
      .then((offer) => {
        if (offer) {
          return offer;
        } else {
          throw new Error(NOT_FOUND_ERROR_MESSAGE);
        }
      });
  }
}
