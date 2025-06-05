/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import {
  getAccessToken,
  newEventActionData,
  newUserData,
  TYPE_BEARER,
} from '../utils';
import { EventAction } from 'src/event-actions/entity/eventAction.entity';

jest.setTimeout(60000); // 60 секунд

describe('EventActionsController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userDto = newUserData();

    const resCreate = await request(app.getHttpServer())
      .post('/users')
      .send(userDto);
    const createdUserId = resCreate.body.id;

    access_token = await getAccessToken(userDto, app);

    const updateDto = { name: faker.internet.username(), role: 'admin' };

    await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /events - should create an events', async () => {
    const dto = await newEventActionData(app, access_token);
    const res = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(dto.name);
  });

  it('POST /events/form - should create an event for form', async () => {
    const dto2 = await newEventActionData(app, access_token);
    const dto = {
      address: dto2.address,
      description: dto2.description,
      name: dto2.name,
      phoneNumber: dto2.phoneNumber,
      coords: dto2.coords,
      tagIds: dto2.tagIds,
      categoryId: dto2.categoryId,
      imagesIds: dto2.imagesIds,
    };
    const res = await request(app.getHttpServer())
      .post('/events/form')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(dto.name);
  });

  it('GET /events - should return array of events', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer()).get('/events').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === resCreate.body.id)).toBe(true);
  });

  it('GET /events/near?...query - should return array of near events', async () => {
    const dto = await newEventActionData(app, access_token);
    await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const dtoGet = {
      latitude: 59.999,
      longitude: 59.999,
      limit: 20,
      page: 1,
      pageSize: 20,
    };
    const query = Object.entries(dtoGet)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
    const res = await request(app.getHttpServer())
      .get(`/events/near?${query}`)
      .expect(200);

    const body = res.body;
    expect(Array.isArray(body)).toBe(true);
    console.log(
      body.map((eventAction: EventAction) => eventAction.coords.coordinates),
    );
  });

  it('GET /events/near/categoryName?...query - should return array of near events by category name', async () => {
    const dto = await newEventActionData(app, access_token);
    await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const categoryName = (
      await request(app.getHttpServer())
        .get(`/category/id/${dto.categoryId}`)
        .expect(200)
    ).body.name;

    const dtoGet = {
      latitude: 59.999,
      longitude: 59.999,
      limit: 20,
      page: 1,
      pageSize: 20,
    };
    const query = Object.entries(dtoGet)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
    const res = await request(app.getHttpServer())
      .get(`/events/near/${categoryName}?${query}`)
      .expect(200);

    const body = res.body;
    expect(Array.isArray(body)).toBe(true);
    if (Array.isArray(body)) {
      expect(
        body.every(
          (eventAction: EventAction) =>
            eventAction.category.name == categoryName,
        ),
      ).toBe(true);
    }
    console.log(
      body.map((eventAction: EventAction) => eventAction.coords.coordinates),
    );
  });

  it('GET /events/:id - should return an events by id', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/events/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('name');
  });

  it('PATCH /events/:id - should update an events', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const updateDto = { name: faker.lorem.words(2) };
    const res = await request(app.getHttpServer())
      .patch(`/events/${createdId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body.name).toBe(updateDto.name);
  });

  it('DELETE /events/:id - should delete an events', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/events/${createdId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer()).get(`/events/${createdId}`).expect(404);
  });
});
