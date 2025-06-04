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

  it('POST /event - should create an event', async () => {
    const dto = await newEventActionData(app, access_token);
    const res = await request(app.getHttpServer())
      .post('/event')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(dto.name);
  });

  it('GET /event - should return array of events', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/event')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer()).get('/event').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === resCreate.body.id)).toBe(true);
  });

  it('GET /event/:id - should return an event by id', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/event')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/event/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('name');
  });

  it('PATCH /event/:id - should update an event', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/event')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const updateDto = { name: faker.lorem.words(2) };
    const res = await request(app.getHttpServer())
      .patch(`/event/${createdId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body.name).toBe(updateDto.name);
  });

  it('DELETE /event/:id - should delete an event', async () => {
    const dto = await newEventActionData(app, access_token);
    const resCreate = await request(app.getHttpServer())
      .post('/event')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/event/${createdId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer()).get(`/event/${createdId}`).expect(404);
  });
});
