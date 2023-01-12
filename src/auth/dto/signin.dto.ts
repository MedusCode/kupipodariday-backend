import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '../../users/dto/user.dto';

export class SigninDto extends PickType(UserDto, ['username', 'password']) {}
