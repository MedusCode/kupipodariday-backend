import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class UserDto {
  @IsString()
  @Length(10, 30)
  public username: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  public about?: string;

  @IsOptional()
  @IsUrl()
  public avatar?: string;

  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(7)
  public password: string;
}
