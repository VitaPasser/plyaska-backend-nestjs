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

@Controller('promotion-events')
export class PromotionEventsController {
  constructor(
    private readonly promotionEventsService: PromotionEventsService,
  ) {}

  @Post()
  create(@Body() createPromotionEventDto: CreatePromotionEventDto) {
    return this.promotionEventsService.create(createPromotionEventDto);
  }

  @Get()
  findAll() {
    return this.promotionEventsService.findAll();
  }

  @Get([':eventActionId', ':promotionId'])
  findOne(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
  ) {
    return this.promotionEventsService.findOne(eventActionId, promotionId);
  }

  @Patch([':eventActionId', ':promotionId'])
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

  @Patch([':eventActionId', ':promotionId'])
  updateAndUpdateTime(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
    @Body() updatePromotionEventDto: UpdatePromotionEventDto,
  ) {
    return this.promotionEventsService.updateAndUpdateTime(
      eventActionId,
      promotionId,
      updatePromotionEventDto,
    );
  }

  @Delete([':eventActionId', ':promotionId'])
  remove(
    @Param('eventActionId') eventActionId: string,
    @Param('promotionId') promotionId: string,
  ) {
    return this.promotionEventsService.remove(eventActionId, promotionId);
  }
}
