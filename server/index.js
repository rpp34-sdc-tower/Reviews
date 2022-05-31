const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db/index');
const getReviews = require('./db/queries/getReviews');
const markReviewHelpful = require('./db/queries/markReviewHelpful');
const markReviewReported = require('./db/queries/markReviewReported');

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
      // data.photo = [];
      var reviews = {
        product: id,
        page: page,
        count: count,
        results: data
      }
      // console.log('hello', data)
      res.status(200).json(reviews);
    })
    .catch(err => {
      console.log('getReviews Error',err);
    })

});

// app.get('/reviews/meta', (req, res) => {})

// POST
// app.post('/reviews', (req, res) => {})

// PUT
app.put('/reviews/:review_id/helpful', (req, res) => {
  let id = req.params.review_id;
  console.log('review_id = ', id)

  markReviewHelpful(id)
    .then(() => {
      console.log('Has been added to helpfulness');
      res.status(204);
      res.end();
    })
    .catch(err => {
      console.log('markReviewHelpful Error',err);
    })

});

app.put('/reviews/:review_id/report', (req, res) => {
  let id = req.query.review_id;
  console.log('review_id = ', id)

  // markReviewReported(id)
  //   .then(() => {
  //     // console.log('The review has been reported.');
  //     // res.status(204);
  //   })
  //   .catch(err => {
  //     console.log('markReviewReported Error',err);
  //   })

});


app.listen(3000, () => {
  console.log('server listening on port 3000')
});