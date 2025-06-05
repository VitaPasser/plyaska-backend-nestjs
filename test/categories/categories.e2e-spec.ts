/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import {
  getAccessToken,
  newCategoryTestCategoryData,
  newUserData,
  TYPE_BEARER,
} from '../utils';

describe('CategoriesController (e2e)', () => {
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

  it('POST /category - should create a category', async () => {
    const dto = newCategoryTestCategoryData();
    const res = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(dto.name);
  });

  it('GET /category - should return array of categories', async () => {
    const dto = newCategoryTestCategoryData();
    const resCreate = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer()).get('/category').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === resCreate.body.id)).toBe(true);
  });

  it('GET /category/id/:id - should return a category by id', async () => {
    const dto = newCategoryTestCategoryData();
    const resCreate = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/category/id/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('name');
  });

  it('GET /category/:name - should return a category by name', async () => {
    const dto = newCategoryTestCategoryData();
    const resCreate = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdName = resCreate.body.name;

    const res = await request(app.getHttpServer())
      .get(`/category/${createdName}`)
      .expect(200);

    expect(res.body).toHaveProperty('name', createdName);
    expect(res.body).toHaveProperty('id');
  });

  it('POST /category/findOrCreateByName/:name - should return a category by name or create and return', async () => {
    const categoryDto = newCategoryTestCategoryData();

    const resCreate = await request(app.getHttpServer())
      .post(`/category/findOrCreateByName/${categoryDto.name}`)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdCategoryId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .post(`/category/findOrCreateByName/${categoryDto.name}`)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('name', categoryDto.name);
    expect(res.body).toHaveProperty('id', createdCategoryId);
  });

  it('PATCH /category/:id - should update a category', async () => {
    const dto = newCategoryTestCategoryData();
    const resCreate = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const updateDto = {
      name: faker.commerce.department() + '_' + faker.string.uuid(),
    };

    const res = await request(app.getHttpServer())
      .patch(`/category/${createdId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body.name).toBe(updateDto.name);
  });

  it('DELETE /category/:id - should delete a category', async () => {
    const dto = newCategoryTestCategoryData();
    const resCreate = await request(app.getHttpServer())
      .post('/category')
      .send(dto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/category/${createdId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/category/${createdId}`)
      .expect(404);
  });
});
