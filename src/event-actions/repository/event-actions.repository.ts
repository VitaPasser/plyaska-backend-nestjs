import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventAction } from '../entity/eventAction.entity';
import { FindNearestWithPromotionAndPaginationOffsetEventActionDto } from '../dto/find-nearest-with-promotion-and-pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventActionRepository {
  constructor(
    @InjectRepository(EventAction)
    private readonly eventActionRepo: Repository<EventAction>,
  ) {}

  async findNearestWithPromotionAndPagination(
    dto: FindNearestWithPromotionAndPaginationOffsetEventActionDto,
  ): Promise<EventAction[]> {
    const pointWKT = `SRID=4326;POINT(${dto.longitude} ${dto.latitude})`;
    return this.eventActionRepo
      .createQueryBuilder('ea')
      .leftJoin(
        'ea.promotionEvents',
        'pe',
        'NOW() BETWEEN pe.startAt AND pe.endAt',
      )
      .leftJoin('pe.promotion', 'p')
      .addSelect('pe.startAt', 'promotionStartAt')
      .addSelect('pe.endAt', 'promotionEndAt')
      .addSelect(
        `
    ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326))
  `,
        'raw_distance',
      )
      .addSelect(
        `
    ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326)) /
    (1 + LOG(1 + COALESCE(MAX(p.power), 0)))
  `,
        'effective_distance',
      )
      .groupBy('ea.id, ')
      .orderBy('effective_distance', 'ASC')
      .limit(dto.limit)
      .offset(dto.offset)
      .setParameter('point', pointWKT)
      .getMany();
  }
}
