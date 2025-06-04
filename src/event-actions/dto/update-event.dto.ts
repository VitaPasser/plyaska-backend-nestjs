import { PartialType } from '@nestjs/mapped-types';
import { CreateEventActionDto } from './create-event.dto';

export class UpdateEventActionDto extends PartialType(CreateEventActionDto) {}
