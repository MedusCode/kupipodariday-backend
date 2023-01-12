import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from '@nestjs/class-validator';
import { User } from '../../users/entities/user.entity';

export class WishDto {
  @IsString()
  @Length(1, 250)
  public name: string;

  @IsUrl()
  public link: string;

  @IsUrl()
  public image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  public price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  public raised: number;

  @IsString()
  @Length(1, 1024)
  public description: string;

  @IsInt()
  @IsPositive()
  public copied: number;

  @IsNotEmpty()
  public owner: User;
}
