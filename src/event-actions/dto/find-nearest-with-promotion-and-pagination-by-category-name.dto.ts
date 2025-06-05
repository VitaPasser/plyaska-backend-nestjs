import { IsNotEmpty, IsString } from 'class-validator';
import {
  FindNearestWithPromotionAndPaginationOffsetEventActionDto,
  FindNearestWithPromotionAndPaginationPageEventActionDto,
} from './find-nearest-with-promotion-and-pagination.dto';

export class FindNearestWithPromotionAndPaginationOffsetEventActionByCategoryNameDto extends FindNearestWithPromotionAndPaginationOffsetEventActionDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;
}

export class FindNearestWithPromotionAndPaginationPageEventActionByCategoryNameDto extends FindNearestWithPromotionAndPaginationPageEventActionDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
