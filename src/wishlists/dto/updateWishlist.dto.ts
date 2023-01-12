import { CreateWishlistDto } from './createWishlist.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}
