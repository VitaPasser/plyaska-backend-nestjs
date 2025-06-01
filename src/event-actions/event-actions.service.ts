import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { EventAction } from './entity/eventAction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class EventActionsService {
  constructor(
    @InjectRepository(EventAction)
    protected eventActionsRepository: Repository<EventAction>,
    protected imagesService: ImagesService,
  ) {}

  create(createEventDto: CreateEventDto) {
    
    return `This action returns all event`;
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: bigint) {
    return `This action returns a #${id} event`;
  }

  update(id: bigint, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: bigint) {
    return `This action removes a #${id} event`;
  }
}
