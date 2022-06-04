const request = require('supertest');
const app = require('./app.js');
const {pool, client} = require('../db/');

const product_id = 94780;
const review_id = 45972;

// describe('GET /reviews', () => {
//   test('It should respond status code 200', async() => {
//     const response = await request(app).get(`/reviews?product_id=${product_id}`);
//     expect (response.statusCode).toBe(200);
//   })
// });

describe('GET /reviews/meta', () => {
  it('It should respond status code 200', async() => {
    const response = await request(app).get(`/reviews/meta?product_id=${product_id}`);
    expect (response.statusCode).toBe(200);
  });
});

describe('POST /reviews', () => {
  it('It should response status code 201', async() => {
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
  }
    const response = await request(app).post('/reviews').send(formData);
    expect (response.statusCode).toBe(201);
  })
});

describe('PUT /reviews/:review_id/helpful', () => {
  it('It should response status code 204', async() => {
    const response = await request(app).put(`/reviews/:${review_id}/helpful`);
    expect (response.statusCode).toBe(204);
  })
});

describe('PUT /reviews/:review_id/report', () => {
  it('It should response status code 204', async() => {
    const response = await request(app).put(`/reviews/:${review_id}/report`);
    expect (response.statusCode).toBe(204);
  })
});