import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { EventAction } from './entity/eventAction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventActionsService {
  constructor(
    @InjectRepository(EventAction)
    protected eventActionsRepository: Repository<EventAction>,
  ) {}

  create(createEventDto: CreateEventDto) {
    return this.eventActionsRepository.create(createEventDto);
  }

  async findAll() {
    return await this.eventActionsRepository.find();
  }

  async findOne(id: bigint) {
    return await this.eventActionsRepository.findOneBy({ id });
  }

  async update(id: bigint, updateEventDto: UpdateEventDto) {
    return await this.eventActionsRepository.update({ id }, updateEventDto);
  }

  async remove(id: bigint) {
    return await this.eventActionsRepository.delete({ id });
  }
}
