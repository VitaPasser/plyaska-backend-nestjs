import { Injectable } from '@nestjs/common';
import { CreatePromotionEventDto } from './dto/create-promotion-event.dto';
import { UpdatePromotionEventDto } from './dto/update-promotion-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionEvent } from './entities/promotion-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionEventsService {
  constructor(
    @InjectRepository(PromotionEvent)
    protected promotionEventsRepository: Repository<PromotionEvent>,
  ) {}
  create(createPromotionEventDto: CreatePromotionEventDto) {
    const endAt = new Date(new Date().getDate() + 31);
    return this.promotionEventsRepository.create({
      ...createPromotionEventDto,
      endAt,
    });
  }

  findAll() {
    return this.promotionEventsRepository.find();
  }

  findOne(eventActionId: bigint, promotionId: bigint) {
    return this.promotionEventsRepository.findOneBy({
      eventActionId,
      promotionId,
    });
  }

  update(
    eventActionId: bigint,
    promotionId: bigint,
    updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    return this.promotionEventsRepository.update(
      {
        eventActionId,
        promotionId,
      },
      updatePromotionEventDto,
    );
  }

  updateAndUpdateTime(
    eventActionId: bigint,
    promotionId: bigint,
    updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    const endAt = new Date(new Date().getDate() + 31);
    return this.promotionEventsRepository.update(
      {
        eventActionId,
        promotionId,
      },
      { ...updatePromotionEventDto, endAt },
    );
  }

  remove(eventActionId: bigint, promotionId: bigint) {
    return this.promotionEventsRepository.delete({
      eventActionId,
      promotionId,
    });
  }
}
