import { PrismaClient, Prisma } from '@prisma/client';
import { Coordinate } from '../entity/coordinate.entity';

/**
 * Тип для передачи сырых SQL-выражений.
 */
// type RawSqlField = { raw: string };

const prisma = new PrismaClient().$extends({
  query: {
    event: {
      create: (params, next) => {
        const data = { ...params.args.data };
        const coords = data.coords as Coordinate | undefined;

        if (coords?.latitude && coords?.longitude) {
          const sqlQuery = `ST_GeogFromText('SRID=4326;POINT(${coords.latitude} ${coords.longitude})')`;
          data.coords = Prisma.sql`${Prisma.raw(sqlQuery)}`;
        }
        return next({ ...params, args: { ...params.args, data } });
      },
    },
  } as const,
});

export default prisma;
