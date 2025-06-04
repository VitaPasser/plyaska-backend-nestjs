import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => EventAction, (eventAction) => eventAction.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  eventActions!: EventAction[];
}
