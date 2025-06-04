import { Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';

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
  @Type(() => CoordinateDto)
  coords: CoordinateDto;

  @IsNotEmpty()
  authorId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  imagesIds: string[];

  @IsArray()
  @IsNotEmpty({ each: true })
  tagIds: string[];

  @IsNotEmpty()
  categoryId: number;
}
