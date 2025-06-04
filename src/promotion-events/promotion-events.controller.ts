import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionEventsService } from './promotion-events.service';
import { CreatePromotionEventDto } from './dto/create-promotion-event.dto';
import { UpdatePromotionEventDto } from './dto/update-promotion-event.dto';
import { Public } from 'src/auth/public.const';

@Controller('promotion-events')
export class PromotionEventsController {
  constructor(
    private readonly promotionEventsService: PromotionEventsService,
  ) {}

  @Post()
  create(@Body() createPromotionEventDto: CreatePromotionEventDto) {
    return this.promotionEventsService.create(createPromotionEventDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.promotionEventsService.findAll();
  }

  @Public()
  @Get(':eventActionId/:promotionId')
  findOne(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
  ) {
    return this.promotionEventsService.findOne(eventActionId, promotionId);
  }

  @Patch(':eventActionId/:promotionId')
  update(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
    @Body() updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    return this.promotionEventsService.update(
      eventActionId,
      promotionId,
      updatePromotionEventDto,
    );
  }

  @Delete(':eventActionId/:promotionId')
  remove(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
  ) {
    return this.promotionEventsService.remove(eventActionId, promotionId);
  }
}
