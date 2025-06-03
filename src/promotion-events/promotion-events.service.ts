import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.promotionEventsRepository.save({
      ...createPromotionEventDto,
      endAt,
    });
  }

  findAll() {
    return this.promotionEventsRepository.find();
  }

  async findOne(eventActionId: string, promotionId: string) {
    const promotionEvent = await this.promotionEventsRepository.findOneBy({
      eventActionId,
      promotionId,
    });
    if (!promotionEvent) throw new NotFoundException();
    return promotionEvent;
  }

  async update(
    eventActionId: string,
    promotionId: string,
    updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    await this.promotionEventsRepository.update(
      {
        eventActionId,
        promotionId,
      },
      updatePromotionEventDto,
    );
    return this.findOne(eventActionId, promotionId);
  }

  async updateAndUpdateTime(
    eventActionId: string,
    promotionId: string,
    updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    const endAt = new Date(new Date().getDate() + 31);
    await this.promotionEventsRepository.update(
      {
        eventActionId,
        promotionId,
      },
      { ...updatePromotionEventDto, endAt },
    );
    return this.findOne(eventActionId, promotionId);
  }

  async remove(eventActionId: string, promotionId: string) {
    const promotionEvent = await this.findOne(eventActionId, promotionId);
    return this.promotionEventsRepository.remove(promotionEvent);
  }
}
