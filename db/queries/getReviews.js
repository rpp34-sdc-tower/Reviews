const pool = require('../index');

const getReviews = (id, sort, count, page) => {
  if (sort === 'newest') {
    sort = 'ORDER BY r.date DESC';
  } else if (sort === 'helpful') {
    sort = 'ORDER BY r.helpfulness DESC';
  } else if (sort === 'relevant') {
    sort = 'ORDER BY r.helpfulness DESC, r.date DESC';
  }

  let queryString = `
  SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, to_timestamp(r.date/1000) AS date, r.reviewer_name, r.helpfulness,
  (
    SELECT array_to_json(array_agg(photosGroup)) FROM
      (
         SELECT p.photo_id AS id, p.url
         FROM reviews_photos p
         inner join reviews r0
         on p.review_id = r0.review_id
         WHERE r.review_id = p.review_id
         GROUP BY p.photo_id
      ) photosGroup
  ) AS photos
    FROM reviews r
    WHERE r.product_id = ${id} AND r.reported <> true
    GROUP BY r.review_id
    ${sort}
    LIMIT ${count}
    OFFSET ${count * page - count};
    `;

  return pool
    .query(queryString)
    .then(data => {
      for (var i = 0; i < data.rows.length; i++) {
        if(data.rows[i].photos === null) {
          data.rows[i].photos = [];
        }
        if(data.rows[i].response === 'null') {
          data.rows[i].response = null;
        }
      }
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