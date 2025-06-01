import {
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
  coord: CoordinateDto;

  @IsNotEmpty()
  authorId: bigint;

  @IsNotEmpty({ each: true })
  imagesIds: bigint[];

  @IsNotEmpty({ each: true })
  tagIds: bigint[];

  @IsNotEmpty()
  categoryId: number;
}
