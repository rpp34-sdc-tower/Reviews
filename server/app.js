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

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET
app.get('/', (request, response) => {
  response.status(200).json({ info: 'Hello, conected!' })
});

app.get('/reviews', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = req.query.sort || 'relevant';
  let id = req.query.product_id;

  getReviews(id, sort, count, page)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).send('server get reviews error');
    })
});

app.get('/reviews/meta', (req, res) => {
  let id = req.query.product_id;
  getReviewsMetadata(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).send('server get reviews metadata error');
    })
});


// POST
app.post('/reviews', (req, res) => {
  var newReview = req.body;
  addReview(newReview.product_id, newReview.rating, newReview.summary, newReview.body, newReview.recommend, newReview.name, newReview.email)
    .then (id => {
      addPhotos(id, newReview.photos);
      addCharacteristicsReviews(id, newReview.characteristics);
      res.sendStatus(201);
    })
    .catch(err => {
      res.status(500).send('server post reviews error');
    })
})


// PUT
app.put('/reviews/:review_id/helpful', (req, res) => {
  let id = req.params.review_id;
  markReviewHelpful(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(500).send('server put a review helpful error');
    })
});

app.put('/reviews/:review_id/report', (req, res) => {
  let id = req.params.review_id;
  markReviewReported(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(500).send('server put a reported review error');
    })
});


// app.listen(3000, () => {
//   console.log('server listening on port 3000')
// });

module.exports = app;