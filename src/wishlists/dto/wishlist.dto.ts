import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from '@nestjs/class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

export class WishlistDto {
  @IsString()
  @Length(1, 250)
  public name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500)
  public description: string;

  @IsUrl()
  public image: string;

  @IsNotEmpty()
  public owner: User;

  @IsNotEmpty()
  public items: Wish[];
}
