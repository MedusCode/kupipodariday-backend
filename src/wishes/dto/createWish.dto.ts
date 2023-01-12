import { PickType } from '@nestjs/mapped-types';
import { WishDto } from './wish.dto';

export class CreateWishDto extends PickType(WishDto, [
  'name',
  'link',
  'image',
  'price',
  'description',
]) {}
