import { IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CoordinateDto } from './create-event.dto';

export class FindNearestWithPromotionAndPaginationOffsetEventActionDto extends CoordinateDto {
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  offset: number;
}

export class FindNearestWithPromotionAndPaginationPageEventActionDto extends CoordinateDto {
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  pageSize: number;
}
