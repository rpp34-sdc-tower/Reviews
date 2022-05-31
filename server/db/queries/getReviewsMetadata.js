const pool = require('../index');

const getReviewsMetadata = (id) => {
  let ratingsQueryString = `
    SELECT (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 1) as "1",
    (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 2) as "2",
    (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 3) as "3",
    (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 4) as "4",
    (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 5) as "5";
    `;

  let recommendQuery = `
    SELECT (SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = true) as true,
    (SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = false) as false;
    `;

  return pool
    .query(ratingsQueryString)
    .then((data)=> {
      // console.log('data = ', data.rows);
      return data.rows;
    })
    .catch(err => console.error('Error executing getReviewsMetadata query', err.stack))
};

module.exports = getReviewsMetadata;