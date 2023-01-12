import { PickType } from '@nestjs/mapped-types';
import { OfferDto } from './offer.dto';
import { IsNumber, Min } from '@nestjs/class-validator';

export class CreateOfferDto extends PickType(OfferDto, ['amount', 'hidden']) {
  @IsNumber()
  @Min(0)
  itemId: number;
}
