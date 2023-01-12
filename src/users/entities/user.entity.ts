import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/entities/base.entity';
import { IsEmail, IsUrl, Length } from '@nestjs/class-validator';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false, unique: true })
  @Length(10, 30)
  public username: string;

  @Column({ default: 'Пока ничего не рассказал о себе', nullable: false })
  @Length(2, 200)
  public about: string;

  @Column({ default: 'https://i.pravatar.cc/300', nullable: false })
  @IsUrl()
  public avatar: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  public email: string;

  @Exclude()
  @Column({ nullable: false })
  public password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  public wishes: Array<Wish>;

  @OneToMany(() => Offer, (offer) => offer.user)
  public offers: Array<Offer>;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  public wishlists: Array<Wishlist>;
}
