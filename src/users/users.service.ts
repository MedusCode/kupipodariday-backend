import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { NOT_FOUND_MESSAGE } from '../utils/constants';
import { UpdateUserDto } from './dto/updateUserDto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    userDto.password = await hash(userDto.password, 10);

    return this.userRepository.save(userDto);
  }

  async findOne(
    conditions: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: conditions,
      relations,
    });

    if (user) {
      return user;
    } else {
      throw new Error(NOT_FOUND_MESSAGE);
    }
  }

  async update(
    conditions: FindOptionsWhere<User>,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    if (updateDto.password) {
      updateDto.password = await hash(updateDto.password, 10);
    }

    const updateResult = await this.userRepository.update(
      conditions,
      updateDto,
    );

    if (updateResult.affected > 0) {
      return await this.findOne(conditions);
    } else {
      throw new Error(NOT_FOUND_MESSAGE);
    }
  }

  search(query: string): Promise<Array<User>> {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
}
