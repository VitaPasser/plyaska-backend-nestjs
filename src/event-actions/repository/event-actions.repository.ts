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
    console.log('test');
    const query = this.eventActionRepo
      .createQueryBuilder('ea')
      .leftJoinAndSelect('ea.category', 'category')
      .leftJoinAndSelect('ea.author', 'author')
      .leftJoinAndSelect('ea.images', 'images')
      .leftJoinAndSelect('ea.tags', 'tags')
      .leftJoinAndSelect('ea.promotionEvents', 'pe')
      .leftJoinAndSelect('pe.promotion', 'ps')
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326))
      `,
        'raw_distance',
      )
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326)) /
        (1 + LOG(1 + COALESCE(MAX(ps.power), 0)))
      `,
        'effective_distance',
      )
      .where((qb) => {
        const sub = qb
          .subQuery()
          .select('1')
          .from('promotion_events', 'pe')
          .where('pe."event_action_id" = ea.id')
          .andWhere('NOW() BETWEEN pe.start_at AND pe.end_at')
          .getQuery();
        return `(${sub}) IS NOT NULL OR TRUE`;
      })
      .groupBy(
        'ea.id, category.id, author.id, images.id, tags.id, pe.promotionId, pe.eventActionId, pe.id, ps.id',
      )
      .orderBy('effective_distance', 'ASC')
      .limit(dto.limit)
      .offset(dto.offset)
      .setParameter('point', pointWKT);
    console.log(query.getSql());
    return query.getMany();
  }
}
