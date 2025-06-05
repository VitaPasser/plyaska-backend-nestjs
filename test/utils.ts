/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { randomInt } from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'fs';
import { Response } from 'supertest';

export async function getAccessToken(
  userDto: {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
  },
  app: INestApplication<any>,
) {
  const loginDto = {
    email: userDto.email,
    password: userDto.password,
  };

  const resLogin = await request(app.getHttpServer())
    .post('/auth/login')
    .send(loginDto)
    .expect(201);
  const access_token: string = resLogin.body.access_token;
  return access_token;
}

export const TYPE_BEARER: { type: 'bearer' } = { type: 'bearer' };

export const newUserData = () => {
  return {
    name: faker.internet.username(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    password: 'TestPass123',
  };
};

export const newTagData = () => ({
  name: faker.word.noun(),
});

export const newPromotionData = async (
  app: INestApplication,
  access_token: string,
) => {
  const dto = newCurrencyData();
  const currency_res = await request(app.getHttpServer())
    .post('/currencies')
    .send(dto)
    .auth(access_token, TYPE_BEARER);
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    power: randomInt(1000000) / 10000 + 1,
    price: randomInt(1000000) / 100,
    currency: currency_res.body.id,
  };
};

export const newCategoryTestCategoryData = () => ({
  name: faker.commerce.department() + '_' + faker.string.uuid(),
});

export const newCurrencyData = () => ({
  quotation: faker.finance.currencyCode(),
});

export async function imageDownload() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  const arrayBufferImage = await (
    await (await fetch(faker.image.urlPicsumPhotos())).blob()
  ).arrayBuffer();
  fs.writeFileSync(testImagePath, Buffer.from(arrayBufferImage));
  return testImagePath;
}

export const newEventActionData = async (
  app: INestApplication,
  access_token: string,
) => {
  const userDto = newUserData();

  const resUser = await request(app.getHttpServer())
    .post('/users')
    .send(userDto)
    .auth(access_token, TYPE_BEARER);

  const resImages: Response[] = [];
  for (let index = 0; index < 3; index++) {
    const testImagePath = await imageDownload();
    resImages.push(
      await request(app.getHttpServer())
        .post('/images/upload')
        .attach('file', testImagePath)
        .auth(access_token, TYPE_BEARER),
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const imagesIds: string[] = resImages.map((res) => res.body.id);

  const resTags: Response[] = [];
  for (let index = 0; index < 3; index++) {
    const tagDto = newTagData();
    resTags.push(
      await request(app.getHttpServer())
        .post('/tags')
        .send(tagDto)
        .auth(access_token, TYPE_BEARER),
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const tagsIds: string[] = resTags.map((res) => res.body.id);

  const categoryName = ['клуб', 'заклад', 'подія'];
  const categoryDto = { name: faker.helpers.arrayElement(categoryName) };
  let categoryId = (
    await request(app.getHttpServer())
      .get(`/category/${categoryDto.name}`)
      .auth(access_token, TYPE_BEARER)
  ).body.id;
  if (!categoryId) {
    categoryId = (
      await request(app.getHttpServer())
        .post('/category')
        .send(categoryDto)
        .auth(access_token, TYPE_BEARER)
    ).body.id;
  }

  const result = {
    name: faker.lorem.words(2),
    address: faker.location.streetAddress(),
    phoneNumber: faker.phone.number(),
    description: faker.lorem.paragraph(),
    coords: {
      latitude: faker.location.latitude({ max: 49, min: 46 }),
      longitude: faker.location.longitude({ max: 31, min: 30.998 }),
    },
    authorId: resUser.body.id,
    imagesIds: imagesIds,
    tagIds: tagsIds,
    categoryId: categoryId,
  };
  return result;
};

export type PromotionEventActionId = {
  promotionId: string;
  eventActionId: string;
};

export const newPromotionEventData = async (
  app: INestApplication,
  access_token: string,
): Promise<PromotionEventActionId> => {
  const promotionId = (
    await request(app.getHttpServer())
      .post('/promotions')
      .send(await newPromotionData(app, access_token))
      .auth(access_token, TYPE_BEARER)
  ).body.id;
  const eventActionId = (
    await request(app.getHttpServer())
      .post('/events')
      .send(await newEventActionData(app, access_token))
      .auth(access_token, TYPE_BEARER)
  ).body.id;
  return {
    promotionId: promotionId,
    eventActionId: eventActionId,
  };
};
