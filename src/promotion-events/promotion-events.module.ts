import { Module } from '@nestjs/common';
import { PromotionEventsService } from './promotion-events.service';
import { PromotionEventsController } from './promotion-events.controller';
import { PromotionEvent } from './entities/promotion-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionEvent])],
  controllers: [PromotionEventsController],
  providers: [PromotionEventsService],
})
export class PromotionEventsModule {}
