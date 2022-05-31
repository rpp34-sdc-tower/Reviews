const pool = require('../index');

const getReviews = (id, sort, count, page) => {
  if (sort === 'newest') {
    sort = 'ORDER BY date DESC';
  } else if (sort === 'helpful') {
    sort = 'ORDER BY helpfulness DESC';
  } else if (sort === 'relevant') {
    sort = 'ORDER BY helpfulness DESC, date DESC';
  }

  // console.log(id)
  // let queryString = `SELECT review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${id} AND reported = false ${sort} LIMIT ${count};`;
  // let photosQueryString = `SELECT photo_id as id, url FROM reviews_photos WHERE review_id = (SELECT review_id FROM reviews WHERE product_id = ${id} AND reported = false);`
  let queryString = `
    SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, to_timestamp(r.date/1000) AS date, r.reviewer_name, r.helpfulness,
    CASE WHEN count(o) = 0 THEN ARRAY[]::json[] ELSE array_agg(o.photo) END AS photos
    FROM reviews r
    LEFT OUTER JOIN
    (
    SELECT p.review_id, json_build_object('id', p.photo_id, 'url', p.url) as photo
    FROM reviews_photos p
	  ORDER BY p.review_id
    ) o
    ON r.review_id = o.review_id
    WHERE r.product_id = ${id} AND r.reported = false
    GROUP BY r.review_id
    ${sort}
    LIMIT ${count};
    `;
  // promise
   return pool
    .query(queryString)
    .then(data => {
      return data.rows;
    })
    .catch(err => console.error('Error executing getReviews query', err.stack))

}

module.exports = getReviews;

// var s = new Date(1602494190229).toISOString()
// expected output "2020-10-12T09:16:30.229Z"
// console.log(s);