import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import { getAccessToken, newUserData, TYPE_BEARER } from '../utils';

// test/users/users.e2e-spec.test.ts

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users - should create a user', async () => {
    const userDto = newUserData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(userDto.name);
  });

  it('GET /users - should return array of users', async () => {
    const userDto = newUserData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resCreate = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get('/users').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u: any) => u.id === resCreate.body.id)).toBe(true);
  });

  it('GET /users/:id - should return a user by id', async () => {
    const userDto = newUserData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resCreate = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    const createdUserId = resCreate.body.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdUserId);
    expect(res.body).toHaveProperty('name');
  });

  it('PATCH /users/:id - should update a user', async () => {
    const userDto = newUserData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resCreate = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    const createdUserId = resCreate.body.id;

    const access_token: string = await getAccessToken(userDto, app);

    const updateDto = { name: faker.internet.username(), role: 'admin' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send(updateDto)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdUserId);
    expect(res.body.name).toBe(updateDto.name);
    expect(res.body.role).toBe(updateDto.role);
  });

  it('DELETE /users/:id - should delete a user', async () => {
    const userDto = newUserData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resCreate = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    const createdUserId = resCreate.body.id;

    const access_token: string = await getAccessToken(userDto, app);
    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .auth(access_token, TYPE_BEARER)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(404);
  });
});
