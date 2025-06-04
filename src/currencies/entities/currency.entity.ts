import { Promotion } from 'src/promotions/entities/promotion.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quotation: string;

  @OneToMany(() => Promotion, (promotion) => promotion.currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Promotion: Promotion[];
}
