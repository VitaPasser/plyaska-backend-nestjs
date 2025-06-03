import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Point } from 'typeorm';

export class CoordinateDto {
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  description: string;

  @ValidateNested()
  coords: Point;

  @IsNotEmpty()
  authorid: string;

  @IsNotEmpty({ each: true })
  imagesIds: string[];

  @IsNotEmpty({ each: true })
  tagIds: string[];

  @IsNotEmpty()
  categoryId: number;
}
