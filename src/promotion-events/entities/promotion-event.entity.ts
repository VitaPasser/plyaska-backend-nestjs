import { EventAction } from 'src/event-actions/entity/eventAction.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promotion_events')
export class PromotionEvent {
  @PrimaryColumn({ name: 'promotion_id', type: 'bigint' })
  promotionId: bigint;

  @PrimaryColumn({ name: 'event_action_id', type: 'bigint' })
  eventActionId: bigint;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionEvents)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @ManyToOne(() => EventAction, (eventAction) => eventAction.PromotionEvents)
  @JoinColumn({ name: 'event_id' })
  eventAction: EventAction;

  @CreateDateColumn({ name: 'start_at' })
  startAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;
}
