import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePromotionEventDto {
  @IsNotEmpty()
  @IsUUID()
  promotionId: string;

  @IsNotEmpty()
  @IsUUID()
  eventActionId: string;
}
