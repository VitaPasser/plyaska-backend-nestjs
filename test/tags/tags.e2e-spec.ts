/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import { getAccessToken, newTagData, newUserData, TYPE_BEARER } from '../utils';

describe('TagsController (e2e)', () => {
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

  it('POST /tags - should create a tag', async () => {
    const tagDto = newTagData();
    const res = await request(app.getHttpServer())
      .post('/tags')
      .send(tagDto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(tagDto.name);
  });

  it('GET /tags - should return array of tags', async () => {
    const tagDto = newTagData();
    const resCreate = await request(app.getHttpServer())
      .post('/tags')
      .send(tagDto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    const res = await request(app.getHttpServer()).get('/tags').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === resCreate.body.id)).toBe(true);
  });

  it('GET /tags/:id - should return a tag by id', async () => {
    const tagDto = newTagData();
    const resCreate = await request(app.getHttpServer())
      .post('/tags')
      .send(tagDto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdTagId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/tags/${createdTagId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdTagId);
    expect(res.body).toHaveProperty('name');
  });

  it('PATCH /tags/:id - should update a tag', async () => {
    const tagDto = newTagData();
    const resCreate = await request(app.getHttpServer())
      .post('/tags')
      .send(tagDto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdTagId = resCreate.body.id;

    const updateDto = { name: faker.word.noun() };
    const res = await request(app.getHttpServer())
      .patch(`/tags/${createdTagId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdTagId);
    expect(res.body.name).toBe(updateDto.name);
  });

  it('DELETE /tags/:id - should delete a tag', async () => {
    const tagDto = newTagData();
    const resCreate = await request(app.getHttpServer())
      .post('/tags')
      .send(tagDto)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdTagId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/tags/${createdTagId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer()).get(`/tags/${createdTagId}`).expect(404);
  });
});
