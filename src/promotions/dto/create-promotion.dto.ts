import { IsNotEmpty } from 'class-validator';

export class CreatePromotionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  power: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  currencyId: number;
}
