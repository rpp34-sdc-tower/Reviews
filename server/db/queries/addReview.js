const pool = require('../index');

const addReview = (productId, rating, summary, body, recommend, name, email) => {
  let queryString = `
    INSERT INTO reviews
    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
    VALUES
    (${productId}, ${rating}, extract(epoch from now()), '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', null, 0)
    RETURNING review_id;`;

  return pool.connect().then((client) => {
    return client
      .query(queryString)
      .then((data) => {
        client.release();
        return data.rows[0].review_id;
      })
      .catch((err) => {
        client.release();
        console.log('Error executing addReview query: ', err);
      });
  });
};

module.exports = addReview;
