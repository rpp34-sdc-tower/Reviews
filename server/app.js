const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('../db/index');
const getReviews = require('../db/queries/getReviews');
const getReviewsMetadata = require('../db/queries/getReviewsMetadata');
const addReview = require('../db/queries/addReview');
const addPhotos = require('../db/queries/addPhotos');
const addCharacteristicsReviews = require('../db/queries/addCharacteristicsReviews');
const markReviewHelpful = require('../db/queries/markReviewHelpful');
const markReviewReported = require('../db/queries/markReviewReported');

const redis = require('redis');
const redisClient = redis.createClient();
redisClient.connect();

const default_expiration = 3600;
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET
app.get('/', (request, response) => {
  response.status(200).json({ info: 'Hello, conected!' })
});

app.get('/reviews', async (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'relevant';
  const id = req.query.product_id;
  const redisQuery = `/reviews:${id}-${sort}-${count}-${page}`;

  const data = await redisClient.get(redisQuery);
  if (data !== null) {
    const parsedData = JSON.parse(data);
    res.status(200).json(parsedData);
  } else {
    getReviews(id, sort, count, page)
    .then(data => {
      redisClient.set(redisQuery, JSON.stringify(data))
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('server get reviews error');
    })
  }
});

app.get('/reviews/meta', async (req, res) => {
  const id = req.query.product_id;
  const redisQuery = `/reviews/meta:${id}`;
  const data = await redisClient.get(redisQuery);
  if (data !== null) {
    const parsedData = JSON.parse(data);
    res.status(200).json(parsedData);
  } else {
    getReviewsMetadata(id)
    .then(data => {
      redisClient.set(redisQuery, JSON.stringify(data))
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('server get reviews metadata error');
    })
  }
});


// POST
app.post('/reviews', (req, res) => {
  const newReview = req.body;
  addReview(newReview.product_id, newReview.rating, newReview.summary, newReview.body, newReview.recommend, newReview.name,
    newReview.email)
    .then(id => {
      addPhotos(id, newReview.photos);
      addCharacteristicsReviews(id, newReview.characteristics);
      res.sendStatus(201);
    })
    .catch (err => {
        res.status(500).send('server post reviews error');
      })
})


// PUT
app.put('/reviews/:review_id/helpful', (req, res) => {
  const id = req.params.review_id;
  markReviewHelpful(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(500).send('server put a review helpful error');
    })
});

app.put('/reviews/:review_id/report', (req, res) => {
  const id = req.params.review_id;
  markReviewReported(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(500).send('server put a reported review error');
    })
});

module.exports = app;