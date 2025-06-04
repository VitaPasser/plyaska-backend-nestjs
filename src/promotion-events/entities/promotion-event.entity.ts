import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promotion_events')
export class PromotionEvent {
  @PrimaryColumn({ name: 'promotion_id', type: 'uuid' })
  promotionId: string;

  @PrimaryColumn({ name: 'event_action_id', type: 'uuid' })
  eventActionId: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionEvents)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @ManyToOne(() => EventAction, (eventAction) => eventAction.promotionEvents)
  @JoinColumn({ name: 'event_action_id' })
  eventAction: EventAction;

  @Column({ name: 'end_at' })
  endAt: Date;

  @CreateDateColumn({ name: 'start_at' })
  startAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;
}
