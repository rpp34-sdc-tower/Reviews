const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db/db.js');

// middleware
app.use(cors());
app.use(express.json());

// GET
app.get('/reviews', (req, res) => {})
app.get('/reviews/meta', (req, res) => {})

// POST
app.post('/reviews', (req, res) => {})

// PUT
app.put('/reviews/:review_id/helpful', (req, res) => {})


app.listen(3000, ()=> {
  console.log('server listening on port 3000')
})