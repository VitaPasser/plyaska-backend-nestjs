import { Injectable } from '@nestjs/common';
import { CreatePromotionEventDto } from './dto/create-promotion-event.dto';
import { UpdatePromotionEventDto } from './dto/update-promotion-event.dto';

@Injectable()
export class PromotionEventsService {
  create(createPromotionEventDto: CreatePromotionEventDto) {
    return 'This action adds a new promotionEvent';
  }

  findAll() {
    return `This action returns all promotionEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotionEvent`;
  }

  update(id: number, updatePromotionEventDto: UpdatePromotionEventDto) {
    return `This action updates a #${id} promotionEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotionEvent`;
  }
}
