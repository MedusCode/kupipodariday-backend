import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsPositive } from '@nestjs/class-validator';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers, { nullable: false })
  public user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  public item: Wish;

  @Column('numeric', { scale: 2, nullable: false })
  @IsPositive()
  public amount: number;

  @Column({ default: false, nullable: false })
  public hidden: boolean;
}
