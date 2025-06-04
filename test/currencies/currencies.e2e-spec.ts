/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import {
  getAccessToken,
  newCurrencyData,
  newUserData,
  TYPE_BEARER,
} from '../utils';

describe('CurrenciesController (e2e)', () => {
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

  it('POST /currencies - should create a currency', async () => {
    const dto = newCurrencyData();
    const res = await request(app.getHttpServer())
      .post('/currencies')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.quotation).toBe(dto.quotation);
  });

  it('GET /currencies - should return array of currencies', async () => {
    const dto = newCurrencyData();
    const resCreate = await request(app.getHttpServer())
      .post('/currencies')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/currencies')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === resCreate.body.id)).toBe(true);
  });

  it('GET /currencies/:id - should return a currency by id', async () => {
    const dto = newCurrencyData();
    const resCreate = await request(app.getHttpServer())
      .post('/currencies')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/currencies/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('quotation');
  });

  it('PATCH /currencies/:id - should update a currency', async () => {
    const dto = newCurrencyData();
    const resCreate = await request(app.getHttpServer())
      .post('/currencies')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const updateDto = { quotation: faker.finance.currencyName() };
    const res = await request(app.getHttpServer())
      .patch(`/currencies/${createdId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body.quotation).toBe(updateDto.quotation);
  });

  it('DELETE /currencies/:id - should delete a currency', async () => {
    const dto = newCurrencyData();
    const resCreate = await request(app.getHttpServer())
      .post('/currencies')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/currencies/${createdId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/currencies/${createdId}`)
      .expect(404);
  });
});
