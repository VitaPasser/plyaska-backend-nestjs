import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionEventsService } from './promotion-events.service';
import { CreatePromotionEventDto } from './dto/create-promotion-event.dto';
import { UpdatePromotionEventDto } from './dto/update-promotion-event.dto';

@Controller('promotion-events')
export class PromotionEventsController {
  constructor(private readonly promotionEventsService: PromotionEventsService) {}

  @Post()
  create(@Body() createPromotionEventDto: CreatePromotionEventDto) {
    return this.promotionEventsService.create(createPromotionEventDto);
  }

  @Get()
  findAll() {
    return this.promotionEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionEventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotionEventDto: UpdatePromotionEventDto) {
    return this.promotionEventsService.update(+id, updatePromotionEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionEventsService.remove(+id);
  }
}
