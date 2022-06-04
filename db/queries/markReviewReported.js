const pool = require('../index');

const markReviewReported = (reviewId) => {
  let queryString = `UPDATE reviews SET reported = true WHERE review_id = ${reviewId};`;

  return pool
    .query(queryString)
    .then(()=> {
      // console.log('successfully reported a review');
    })
    .catch(err => console.log('Error executing markReviewReported query', err))
};

module.exports = markReviewReported;
