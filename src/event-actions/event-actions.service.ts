import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Point, Repository } from 'typeorm';
import { EventAction } from './entity/eventAction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventActionsService {
  constructor(
    @InjectRepository(EventAction)
    protected eventActionsRepository: Repository<EventAction>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const coords: Point = {
      type: 'Point',
      coordinates: [
        createEventDto.coords.latitude,
        createEventDto.coords.longitude,
      ],
    };
    const eventAction = { ...createEventDto, coords };
    return this.eventActionsRepository.save(eventAction);
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
    let eventAction;
    if (updateEventDto.coords) {
      const coords: Point = {
        type: 'Point',
        coordinates: [
          updateEventDto.coords.latitude,
          updateEventDto.coords.longitude,
        ],
      };
      eventAction = { ...updateEventDto, coords };
    } else {
      eventAction = { ...updateEventDto };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.eventActionsRepository.update({ id }, eventAction);
    return this.findOne(id);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    await this.eventActionsRepository.delete({ id });
    return event;
  }
}
