const pool = require('../index');

const getReviews = (id, sort, count, page) => {
  if (sort === 'newest') {
    sort = 'ORDER BY date DESC';
  } else if (sort === 'helpful') {
    sort = 'ORDER BY helpfulness DESC';
  } else if (sort === 'relevant') {
    sort = 'ORDER BY helpfulness DESC, date DESC';
  }

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

   return pool
    .query(queryString)
    .then(data => {
      var reviews = {
        product: id,
        page: page,
        count: count,
        results: data.rows
      }
      return reviews;
    })
    .catch(err => console.log('Error executing getReviews query', err))
}

module.exports = getReviews;