import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from '@nestjs/class-validator';

export class OfferDto {
  @IsNotEmpty()
  public user: User;

  @IsNotEmpty()
  public item: Wish;

  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsOptional()
  @IsBoolean()
  public hidden?: boolean;
}
