const pool = require('../index');

const getReviews = (id, sort, count, page) => {
  if (sort === 'newest') {
    sort = 'ORDER BY date DESC';
  } else if (sort === 'helpful') {
    sort = 'ORDER BY helpfulness DESC';
  } else if (sort === 'relevant') {
    sort = 'ORDER BY date DESC, helpfulness DESC';
  }

  // console.log(id)
  let queryString = `SELECT review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${id} AND reported = false ${sort} LIMIT ${count};`;

  // promise
   return pool
    .query(queryString)
    .then(data => {
      // console.log('data',data.rows)
      for (var i = 0; i < data.rows.length; i++) {
        data.rows[i].photos = [];
      }
      return data.rows;
    })
    .catch(err => console.error('Error executing getReviews query', err.stack))

}

module.exports = getReviews;

var s = new Date(1602494190229).toISOString()
// expected output "2020-10-12T09:16:30.229Z"
// console.log(s);