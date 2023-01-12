import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';
import { UpdateUserDto } from './dto/updateUserDto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto) {
    userDto.password = await hash(userDto.password, 10);

    return this.userRepository.save(userDto);
  }

  findOne(
    conditions: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ) {
    return this.userRepository
      .findOne({ where: conditions, relations })
      .then((user) => {
        if (user) {
          return user;
        } else {
          throw new Error(NOT_FOUND_ERROR_MESSAGE);
        }
      });
  }

  async update(conditions: FindOptionsWhere<User>, updateDto: UpdateUserDto) {
    if (updateDto.password) {
      updateDto.password = await hash(updateDto.password, 10);
    }

    return this.userRepository.update(conditions, updateDto).then((result) => {
      if (result.affected > 0) {
        return this.findOne(conditions);
      } else {
        throw new Error(NOT_FOUND_ERROR_MESSAGE);
      }
    });
  }

  search(query: string) {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
}
