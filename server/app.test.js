const request = require('supertest');
const app = require('./app.js');
const pool = require('../db/');

const product_id = 94780;
const review_id = 45973;

afterAll(async () => {
  await pool.end();
});

// describe('GET /reviews', () => {
//   test('It should respond status code 200', async() => {
//     const response = await request(app).get(`/reviews?product_id=${product_id}`);
//     expect (response.statusCode).toBe(200);
//   })
// });

describe('GET /reviews/meta', () => {
  test('It should respond status code 200', async () => {
    const response = await request(app).get(`/reviews/meta?product_id=${product_id}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /reviews', () => {
  let id;
  const formData = {
    product_id: product_id,
    rating: 5,
    summary: "love it",
    body: "I would recommend this product.",
    recommend: true,
    name: "john",
    email: "john@gmail.com",
    photos: ["dkljflkajoifjeoaihdoifhjalekjflakfjoiejhadfhoiej"],
    characteristics: {
      "5": 5,
      "6": 5,
      "7": 5
    }
  };

  afterEach(async () => {
      await pool.query(`DELETE FROM reviews_photos WHERE review_id = '${id}';`);
      await pool.query(`DELETE FROM reviews_characteristics WHERE review_id = '${id}';`);
      await pool.query(`DELETE FROM reviews WHERE review_id = ${id};`);
  });

  test('It should response status code 201', async () => {
    const response = await request(app).post('/reviews').send(formData);
    expect(response.statusCode).toBe(201);
    const data = await pool.query(`SELECT review_id FROM reviews where product_id = ${product_id} ORDER BY date DESC limit 1;`);
    id = data.rows[0].review_id;
  })
});

describe('PUT /reviews/:review_id/helpful', () => {
  let helpfulnessBeforeTest;
  beforeEach(async () => {
    const data = await pool.query(`SELECT helpfulness FROM reviews WHERE review_id = ${review_id}`);
    helpfulnessBeforeTest = data.rows[0].helpfulness;
  })

  afterEach(async () => {
    await pool.query(`UPDATE reviews SET helpfulness = ${helpfulnessBeforeTest} WHERE review_id = ${review_id};`);
  });

  test('It should response status code 204', async () => {
    const response = await request(app).put(`/reviews/${review_id}/helpful`);
    expect(response.statusCode).toBe(204);
  })
});

describe('PUT /reviews/:review_id/report', () => {
  let reportBeforeTest;
  beforeEach(async () => {
    const data = await pool.query(`SELECT reported FROM reviews WHERE review_id = ${review_id}`);
    reportBeforeTest = data.rows[0].helpfulness;
  })

  afterEach(async () => {
    await pool.query(`UPDATE reviews SET reported = false WHERE review_id = ${review_id};`);
  });

  test('It should response status code 204', async () => {
    const response = await request(app).put(`/reviews/${review_id}/report`);
    expect(response.statusCode).toBe(204);
  })
});