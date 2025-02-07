import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RankingController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // On charge l'application entière
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/ranking (GET) should return ranking data', async () => {
    const response = await request(app.getHttpServer()).get('/api/ranking').expect(200);
    expect(response.body).toBeInstanceOf(Array); // Vérifie que c'est un tableau
  });

  it('/api/ranking/events (SSE) should receive SSE events', (done) => {
    const client = request(app.getHttpServer()).get('/api/ranking/events');

    client
      .set('Accept', 'text/event-stream')
      .expect('Content-Type', /text\/event-stream/)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
