import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/entities/base.entity';
import { IsOptional, IsUrl, Length, MaxLength } from '@nestjs/class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ nullable: false })
  @Length(1, 250)
  public name: string;

  @IsOptional()
  @Column({ nullable: true })
  @MaxLength(1500)
  public description?: string;

  @Column({ nullable: false })
  @IsUrl()
  public image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { nullable: false })
  public owner: User;

  @ManyToMany(() => Wish, { nullable: false })
  @JoinTable({ name: 'wishlist_item' })
  public items: Wish[];
}
