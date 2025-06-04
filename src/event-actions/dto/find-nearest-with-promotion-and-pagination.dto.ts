import { IsNotEmpty, IsPositive } from 'class-validator';
import { CoordinateDto } from './create-event.dto';

export class FindNearestWithPromotionAndPaginationOffsetEventActionDto extends CoordinateDto {
  @IsNotEmpty()
  @IsPositive()
  limit: number;

  @IsNotEmpty()
  @IsPositive()
  offset: number;
}

export class FindNearestWithPromotionAndPaginationPageEventActionDto extends CoordinateDto {
  @IsNotEmpty()
  @IsPositive()
  limit: number;

  @IsNotEmpty()
  @IsPositive()
  page: number;

  @IsNotEmpty()
  @IsPositive()
  pageSize: number;
}
