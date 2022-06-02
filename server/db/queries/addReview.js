const pool = require('../index');

const addReview = (productId, rating, summary, body, recommend, name, email, date) => {
  let queryString = `
    INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
    VALUES (
      ${productId}, ${rating}, extract(epoch from now()), ${summary}, ${body}, ${recommend}, false, ${name}, ${email}, null, 0
    );`;

  return pool
    .query(queryString)
    .then(()=> {
      console.log('successfully added a review');
    })
    .catch(err => console.error('Error executing addReview query', err.stack))
};

module.exports = addReview;
