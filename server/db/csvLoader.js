const fs = require('fs');
const fastcsv = require('fast-csv');
const path = require('path');
const csv = path.join('../../docs/reviews_csv');
const Pool = require('pg').Pool;

let stream = fs.createReadStream(csv + '/reviews.csv');
const pool = new Pool({
  user: 'postgres',
  password: '12345',
  host: 'localhost',
  port: 5432,
  database: 'reviewsServer'
});

let csvStream = fastcsv
  .parse({ skipRows: 1 })
  .on('data', (data) => {
    const query =
      "INSERT INTO reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        client.query(query, data, (err, res) => {
          if (err) {
            console.log("error: " + err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", data);
          }
        });
      } finally {
        done();
      }
    });
  })


stream.pipe(csvStream);