import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.eventActionsRepository.save(createEventDto);
  }

  async findAll() {
    return await this.eventActionsRepository.find();
  }

  async findOne(id: string) {
    const event = await this.eventActionsRepository.findOneBy({ id });
    if (!event) throw new NotFoundException();
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.eventActionsRepository.update({ id }, updateEventDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return await this.eventActionsRepository.remove(event);
  }
}
