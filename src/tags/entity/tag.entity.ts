import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => EventAction, (eventAction) => eventAction.tags)
  eventActions: EventAction[];
}
