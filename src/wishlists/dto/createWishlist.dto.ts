import { PickType } from '@nestjs/mapped-types';
import { IsNumber, Min } from '@nestjs/class-validator';
import { WishlistDto } from './wishlist.dto';

export class CreateWishlistDto extends PickType(WishlistDto, [
  'name',
  'image',
  'description',
]) {
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  itemsId: Array<number>;
}
