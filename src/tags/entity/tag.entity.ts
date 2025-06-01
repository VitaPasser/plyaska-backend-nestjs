import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column()
  name: string;

  @ManyToMany(() => EventAction, (eventAction) => eventAction.tags)
  eventActions: EventAction[];
}
