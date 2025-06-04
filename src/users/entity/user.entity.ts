import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @OneToMany(() => EventAction, (eventAction) => eventAction.author, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  eventActions!: EventAction[];
}
