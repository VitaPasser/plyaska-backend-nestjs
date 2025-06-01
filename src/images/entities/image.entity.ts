import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column()
  src: string;

  @ManyToOne(() => EventAction, (eventAction) => eventAction.images)
  eventActions: EventAction;
}
