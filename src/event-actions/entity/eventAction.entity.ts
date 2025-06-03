import { Category } from 'src/categories/entity/category.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  Point,
  JoinTable,
} from 'typeorm';
import { Image } from 'src/images/entities/image.entity';
import { PromotionEvent } from 'src/promotion-events/entities/promotion-event.entity';

@Entity('event_actions')
export class EventAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  description: string;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coords: Point;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @ManyToOne(() => User, (user) => user.eventActions)
  author: User;

  @ManyToMany(() => Image)
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Tag, (tag) => tag.eventActions)
  tags: Tag[];

  @ManyToOne(() => Category, (category) => category.eventActions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => PromotionEvent, (pe) => pe.eventAction)
  PromotionEvents: PromotionEvent[];
}
