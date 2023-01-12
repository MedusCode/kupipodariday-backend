import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/entities/base.entity';
import { IsInt, IsPositive, IsUrl, Length } from '@nestjs/class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({ nullable: false })
  @Length(1, 250)
  public name: string;

  @Column({ nullable: false })
  @IsUrl()
  public link: string;

  @Column({ nullable: false })
  @IsUrl()
  public image: string;

  @Column('numeric', { scale: 2, nullable: false })
  @IsPositive()
  public price: number;

  @Column('numeric', { scale: 2, nullable: false })
  @IsPositive()
  public raised: number;

  @Column({ nullable: false })
  @Length(1, 1024)
  public description: string;

  @Column('int', { nullable: false })
  @IsInt()
  @IsPositive()
  public copied: number;

  @ManyToOne(() => User, (user) => user.wishes, { nullable: false })
  public owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  public offers: Array<Offer>;
}
