import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateEventActionDto } from './dto/create-event.dto';
import { UpdateEventActionDto } from './dto/update-event.dto';
import { Repository, Point } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindNearestWithPromotionAndPaginationOffsetEventActionDto,
  FindNearestWithPromotionAndPaginationPageEventActionDto,
} from './dto/find-nearest-with-promotion-and-pagination.dto';
import { EventAction } from './entity/eventAction.entity';
import { EventActionRepository } from './repository/event-actions.repository';

@Injectable()
export class EventActionsService {
  constructor(
    @InjectRepository(EventAction)
    protected eventActionsRepository: Repository<EventAction>,
    @Inject(EventActionRepository)
    private readonly eventActionRepositoryService: EventActionRepository,
  ) {}

  create(createEventDto: CreateEventActionDto) {
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

  async findNearestWithPromotionAndPagination(
    dto: FindNearestWithPromotionAndPaginationPageEventActionDto,
  ) {
    const { page, pageSize, limit, ...coords } = dto;
    const pageNumber = page - 1 > 0 ? page - 1 : 1;
    const offset = pageNumber * pageSize;
    const dtoWithOffset: FindNearestWithPromotionAndPaginationOffsetEventActionDto =
      { limit, offset, ...coords };
    return await this.eventActionRepositoryService.findNearestWithPromotionAndPagination(
      dtoWithOffset,
    );
  }

  async findOne(id: string) {
    const event = await this.eventActionsRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        author: true,
        images: true,
        promotionEvents: true,
      },
    });
    if (!event) throw new NotFoundException();
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventActionDto) {
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
