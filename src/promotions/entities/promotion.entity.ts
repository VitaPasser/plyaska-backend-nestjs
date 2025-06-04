import { Currency } from 'src/currencies/entities/currency.entity';
import { PromotionEvent } from 'src/promotion-events/entities/promotion-event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  power: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Currency, (currency) => currency.promotions)
  currency: Currency;

  @OneToMany(() => PromotionEvent, (pe) => pe.promotion, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  promotionEvents!: PromotionEvent[];
}
