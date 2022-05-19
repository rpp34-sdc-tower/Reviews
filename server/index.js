const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db/db.js');
const getReviews = require('./db/queries/getReviews');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET
app.get('/', (request, response) => {
  response.status(200).json({ info: 'Hello, conected!' })
})
app.get('/reviews', getReviews);
// app.get('/reviews/meta', (req, res) => {})

// POST
// app.post('/reviews', (req, res) => {})

// PUT
// app.put('/reviews/:review_id/helpful', (req, res) => {})


app.listen(3000, ()=> {
  console.log('server listening on port 3000')
})