import { IsString, MinLength } from '@nestjs/class-validator';

export class SearchDto {
  @IsString()
  @MinLength(1)
  public query: string;
}
