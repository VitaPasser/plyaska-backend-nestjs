import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionEventDto } from './create-promotion-event.dto';

export class UpdatePromotionEventDto extends PartialType(CreatePromotionEventDto) {}
