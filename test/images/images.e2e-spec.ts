/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import * as fs from 'fs';
import { faker } from '@faker-js/faker/.';
import {
  getAccessToken,
  imageDownload,
  newUserData,
  TYPE_BEARER,
} from '../utils';

jest.setTimeout(60000); // 60 секунд

describe('ImagesController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let testImagePath: string;

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

    testImagePath = await imageDownload();
    if (!testImagePath) {
      throw new Error('imageDownload() did not return a valid path');
    }
  });

  afterAll(async () => {
    await app.close();
    if (testImagePath && fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  it('POST /images/upload - should upload and create an image', async () => {
    const res = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', testImagePath)
      .auth(access_token, TYPE_BEARER)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('src');
  });

  it('GET /images - should return array of images', async () => {
    await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', testImagePath)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', testImagePath)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const res = await request(app.getHttpServer()).get('/images').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /images/:id - should return an image by id', async () => {
    const resCreate = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', testImagePath)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    const res = await request(app.getHttpServer())
      .get(`/images/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('src');

    const path = res.body.src;

    await request(app.getHttpServer()).get(`/${path}`).expect(200);
  });

  it('DELETE /images/:id - should delete an image', async () => {
    const resCreate = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', testImagePath)
      .auth(access_token, TYPE_BEARER)
      .expect(201);
    const createdId = resCreate.body.id;

    await request(app.getHttpServer())
      .delete(`/images/${createdId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer()).get(`/images/${createdId}`).expect(404);
  });
});
