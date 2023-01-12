import { PartialType, PickType } from '@nestjs/mapped-types';
import { WishDto } from './wish.dto';

export class UpdateWishDto extends PartialType(
  PickType(WishDto, ['description', 'price']),
) {}
