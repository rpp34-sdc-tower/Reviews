const pool = require('../db');

const getReviews = (request, response) => {
  let id = request.query.product_id;
  let count = request.query.count;
  let sort = request.query.sort;
  if (sort === 'newest') {
    sort = 'ORDER BY date DESC';
  } else if (sort === 'helpful') {
    sort = 'ORDER BY helpfulness DESC';
  } else if (sort === 'relevant') {
    sort = 'ORDER BY date DESC, helpfulness DESC';
  }

  console.log(id)
  let queryString = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${id} AND reported = false ${sort} LIMIT ${count};`;

  // callback
  // pool.query(queryString, (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   var reviews = {
  // product: id,
  // page: 0,
  // count: count,
  // results: results.rows
  //   }
  //   response.status(200).json(reviews);
  //   pool.end();
  // });

  // promise
  pool
    .query(queryString)
    .then(data => {
      var reviews = {
        product: id,
        page: 0,
        count: count,
        results: data.rows
      }
      response.status(200).json(reviews);
    })
    .catch(err => console.error('Error executing getReviews query', err.stack))

}

module.exports = getReviews;

var s = new Date(1602494190229).toISOString()
// expected output "2020-10-12T09:16:30.229Z"
console.log(s);