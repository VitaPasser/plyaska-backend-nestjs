import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column()
  name: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @OneToMany(() => EventAction, (eventAction) => eventAction.author)
  eventActions: EventAction[];
}
