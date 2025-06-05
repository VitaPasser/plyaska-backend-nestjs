import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventAction } from '../entity/eventAction.entity';
import { FindNearestWithPromotionAndPaginationOffsetEventActionDto } from '../dto/find-nearest-with-promotion-and-pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindNearestWithPromotionAndPaginationOffsetEventActionByCategoryNameDto } from '../dto/find-nearest-with-promotion-and-pagination-by-category-name.dto';

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
      .leftJoinAndSelect('ea.author', 'author')
      .leftJoinAndSelect('ea.category', 'category')
      .leftJoinAndSelect('ea.images', 'images')
      .leftJoinAndSelect('ea.tags', 'tags')
      .leftJoinAndSelect(
        'ea.promotionEvents',
        'pe',
        'NOW() BETWEEN pe.startAt AND pe.endAt',
      )
      .leftJoinAndSelect('pe.promotion', 'promotion')
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326))
      `,
        'raw_distance',
      )
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326)) /
        (1 + LOG(1 + COALESCE(MAX(promotion.power), 0)))
      `,
        'effective_distance',
      )
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('ea_sub.id')
          .from(EventAction, 'ea_sub')
          .leftJoin(
            'ea_sub.promotionEvents',
            'pe_sub',
            'NOW() BETWEEN pe_sub.startAt AND pe_sub.endAt',
          )
          .leftJoin('pe_sub.promotion', 'promotion_sub')
          // .addSelect(
          // `
          // ST_DistanceSphere(ea_sub.coords, ST_GeomFromText(:point, 4326)) /
          // (1 + LOG(1 + COALESCE(MAX(promotion_sub.power), 0)))
          // `,
          //   'effective_distance_sub',
          // )
          .groupBy('ea_sub.id')
          .orderBy(
            `
            ST_DistanceSphere(ea_sub.coords, ST_GeomFromText(:point, 4326)) /
            (1 + LOG(1 + COALESCE(MAX(promotion_sub.power), 0)))
            `,
            'ASC',
          )
          .limit(dto.limit)
          .offset(dto.offset)
          .getQuery();
        return 'ea.id IN ' + subQuery;
      })
      .groupBy(
        'ea.id, pe.promotion_id, pe.event_action_id, promotion.id, images.id, tags.id, author.id, category.id',
      )
      .orderBy('effective_distance', 'ASC')
      .setParameter('point', pointWKT)
      .getMany();
  }

  async findNearestWithPromotionAndPaginationByCategoryName(
    dto: FindNearestWithPromotionAndPaginationOffsetEventActionByCategoryNameDto,
  ): Promise<EventAction[]> {
    const pointWKT = `SRID=4326;POINT(${dto.longitude} ${dto.latitude})`;
    return this.eventActionRepo
      .createQueryBuilder('ea')
      .leftJoinAndSelect('ea.author', 'author')
      .leftJoinAndSelect('ea.category', 'category')
      .leftJoinAndSelect('ea.images', 'images')
      .leftJoinAndSelect('ea.tags', 'tags')
      .leftJoinAndSelect(
        'ea.promotionEvents',
        'pe',
        'NOW() BETWEEN pe.startAt AND pe.endAt',
      )
      .leftJoinAndSelect('pe.promotion', 'promotion')
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326))
      `,
        'raw_distance',
      )
      .addSelect(
        `
        ST_DistanceSphere(ea.coords, ST_GeomFromText(:point, 4326)) /
        (1 + LOG(1 + COALESCE(MAX(promotion.power), 0)))
      `,
        'effective_distance',
      )
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('ea_sub.id')
          .from(EventAction, 'ea_sub')
          .leftJoin(
            'ea_sub.promotionEvents',
            'pe_sub',
            'NOW() BETWEEN pe_sub.startAt AND pe_sub.endAt',
          )
          .leftJoin('pe_sub.promotion', 'promotion_sub')
          // .addSelect(
          // `
          // ST_DistanceSphere(ea_sub.coords, ST_GeomFromText(:point, 4326)) /
          // (1 + LOG(1 + COALESCE(MAX(promotion_sub.power), 0)))
          // `,
          //   'effective_distance_sub',
          // )
          .innerJoin(
            'ea_sub.category',
            'category_sub',
            'category_sub.name = :categoryName',
          )
          .setParameter('categoryName', dto.categoryName)
          .groupBy('ea_sub.id')
          .orderBy(
            `
            ST_DistanceSphere(ea_sub.coords, ST_GeomFromText(:point, 4326)) /
            (1 + LOG(1 + COALESCE(MAX(promotion_sub.power), 0)))
            `,
            'ASC',
          )
          .limit(dto.limit)
          .offset(dto.offset)
          .getQuery();
        return 'ea.id IN ' + subQuery;
      })
      .groupBy(
        'ea.id, pe.promotion_id, pe.event_action_id, promotion.id, images.id, tags.id, author.id, category.id',
      )
      .orderBy('effective_distance', 'ASC')
      .setParameter('point', pointWKT)
      .getMany();
  }
}
