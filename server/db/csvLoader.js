const fs = require('fs');
const fastcsv = require('fast-csv');
const path = require('path');
const csv = path.join('../../reviews_csv');
const pool = require('./index');

let stream = fs.createReadStream(csv + '/reviews.csv');
let csvStream = fastcsv
  .parse({ headers: true, maxRows: 5 })
  .on('data', (data) => {
    var date = parseInt(data.date);
    var formattedDate = new Date(date).toISOString();
    data.date = formattedDate;
    if (data.response === 'null') {
      data.response = '';
    }
    if (data.helpfulness === 0) {
      data.helpfulness = 0;
    }
    delete data.reviewer_email;
    // data.photos = [];
    // console.log('new data',  data);

    // insert individually
    // const queryString =
    //   "INSERT INTO reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    // pool.connect((err, client, done) => {
    //   if (err) throw err;
    //   try {
    //     client.query(queryString, data, (err, res) => {
    //       if (err) {
    //         console.log("error: " + err.stack);
    //       } else {
    //         console.log("inserted " + res.rowCount + " row:", data);
    //       }
    //     });
    //   } finally {
    //     done();
    //   }
    // });
  })
  .on('end', rowCount => console.log('rowCount ' + rowCount + ' done!'));


stream.pipe(csvStream);