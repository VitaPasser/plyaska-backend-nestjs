import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Currency } from 'src/currencies/entities/currency.entity';

export class CreatePromotionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  power: number;

  @IsNotEmpty()
  price: number;

  @ValidateNested()
  currency: Currency;
}
