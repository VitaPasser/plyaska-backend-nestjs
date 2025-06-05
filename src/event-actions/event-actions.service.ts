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
import {
  FindNearestWithPromotionAndPaginationOffsetEventActionByCategoryNameDto,
  FindNearestWithPromotionAndPaginationPageEventActionByCategoryNameDto,
} from './dto/find-nearest-with-promotion-and-pagination-by-category-name.dto';

@Injectable()
export class EventActionsService {
  constructor(
    @InjectRepository(EventAction)
    protected eventActionsRepository: Repository<EventAction>,
    @Inject(EventActionRepository)
    private readonly eventActionRepositoryService: EventActionRepository,
  ) {}

  async create(createEventDto: CreateEventActionDto) {
    const coords: Point = {
      type: 'Point',
      coordinates: [
        createEventDto.coords.latitude,
        createEventDto.coords.longitude,
      ],
    };
    const eventAction = this.eventActionsRepository.create({
      ...createEventDto,
      coords,
      author: { id: createEventDto.authorId },
      category: { id: createEventDto.categoryId },
      images: createEventDto.imagesIds.map((id) => ({ id })),
      tags: createEventDto.tagIds.map((id) => ({ id })),
    });
    return this.eventActionsRepository.save(eventAction);
  }

  async findAll() {
    return await this.eventActionsRepository.find({
      relations: {
        category: true,
        author: true,
        images: true,
        promotionEvents: true,
      },
    });
  }

  async findNearestWithPromotionAndPagination(
    dto: FindNearestWithPromotionAndPaginationPageEventActionDto,
  ) {
    const { page, pageSize, limit, ...coords } = dto;
    const pageNumber = page - 1 <= 0 ? 0 : page - 1;
    const offset = pageNumber * pageSize;
    const dtoWithOffset: FindNearestWithPromotionAndPaginationOffsetEventActionDto =
      { limit, offset, ...coords };
    return await this.eventActionRepositoryService.findNearestWithPromotionAndPagination(
      dtoWithOffset,
    );
  }

  async findNearestWithPromotionAndPaginationByCategoryName(
    dto: FindNearestWithPromotionAndPaginationPageEventActionByCategoryNameDto,
  ) {
    const { page, pageSize, limit, ...dto2 } = dto;
    const pageNumber = page - 1 <= 0 ? 0 : page - 1;
    const offset = pageNumber * pageSize;
    const dtoWithOffset: FindNearestWithPromotionAndPaginationOffsetEventActionByCategoryNameDto =
      { limit, offset, ...dto2 };
    return await this.eventActionRepositoryService.findNearestWithPromotionAndPaginationByCategoryName(
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
    const eventAction: any = { ...updateEventDto };

    if (updateEventDto.coords) {
      eventAction.coords = {
        type: 'Point',
        coordinates: [
          updateEventDto.coords.latitude,
          updateEventDto.coords.longitude,
        ],
      };
    }

    if (updateEventDto.authorId) {
      eventAction.author = { id: updateEventDto.authorId };
    }
    if (updateEventDto.categoryId) {
      eventAction.category = { id: updateEventDto.categoryId };
    }
    if (updateEventDto.imagesIds) {
      eventAction.images = updateEventDto.imagesIds.map((id) => ({ id }));
    }
    if (updateEventDto.tagIds) {
      eventAction.tags = updateEventDto.tagIds.map((id) => ({ id }));
    }

    await this.eventActionsRepository.update({ id }, eventAction);
    return this.findOne(id);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    await this.eventActionsRepository.delete({ id });
    return event;
  }
}
