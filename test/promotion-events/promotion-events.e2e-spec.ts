/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import {
  getAccessToken,
  newPromotionEventData,
  newUserData,
  TYPE_BEARER,
} from '../utils';

jest.setTimeout(60000); // 60 секунд

describe('PromotionEventsController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      console.log('App module compiled');
      app = moduleFixture.createNestApplication();
      await app.init();
      console.log('App initialized');

      const userDto = newUserData();

      const resCreate = await request(app.getHttpServer())
        .post('/users')
        .send(userDto);
      if (!resCreate.body?.id) throw new Error('User creation failed');
      const createdUserId = resCreate.body.id;

      access_token = await getAccessToken(userDto, app);
      if (!access_token) throw new Error('Failed to get access token');

      const updateDto = { role: 'admin' };
      await request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send(updateDto)
        .auth(access_token, TYPE_BEARER);
    } catch (e) {
      console.error('beforeAll error:', e);
      throw e;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /promotion-events - should create a promotion-event', async () => {
    const dto = await newPromotionEventData(app, access_token);
    const res = await request(app.getHttpServer())
      .post('/promotion-events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('eventActionId', dto.eventActionId);
    expect(res.body).toHaveProperty('promotionId', dto.promotionId);
  });

  it('GET /promotion-events - should return array of promotion-events', async () => {
    await request(app.getHttpServer())
      .post('/promotion-events')
      .send(await newPromotionEventData(app, access_token))
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    await request(app.getHttpServer())
      .post('/promotion-events')
      .send(await newPromotionEventData(app, access_token))
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const res = await request(app.getHttpServer())
      .get('/promotion-events')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /promotion-events/:eventActionId/:promotionId - should return a promotion-event by ids', async () => {
    const dto = await newPromotionEventData(app, access_token);
    await request(app.getHttpServer())
      .post('/promotion-events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/promotion-events/${dto.eventActionId}/${dto.promotionId}`)
      .expect(200);

    expect(res.body).toHaveProperty('eventActionId', dto.eventActionId);
    expect(res.body).toHaveProperty('promotionId', dto.promotionId);
  });

  it('PATCH /promotion-events/:eventActionId/:promotionId - should update a promotion-event', async () => {
    const dto = await newPromotionEventData(app, access_token);
    await request(app.getHttpServer())
      .post('/promotion-events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const updateDto = {};
    const res = await request(app.getHttpServer())
      .patch(`/promotion-events/${dto.eventActionId}/${dto.promotionId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('eventActionId', dto.eventActionId);
    expect(res.body).toHaveProperty('promotionId', dto.promotionId);
  });

  it('DELETE /promotion-events/:eventActionId/:promotionId - should delete a promotion-event', async () => {
    const dto = await newPromotionEventData(app, access_token);
    await request(app.getHttpServer())
      .post('/promotion-events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/promotion-events/${dto.eventActionId}/${dto.promotionId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/promotion-events/${dto.eventActionId}/${dto.promotionId}`)
      .expect(404);
  });
});
