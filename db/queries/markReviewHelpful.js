const pool = require('../index');

const markReviewHelpful = (reviewId) => {
  let queryString = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${reviewId};`;

  return pool
    .query(queryString)
    .then(()=> {
      // console.log('successfully marked helpful review');
    })
    .catch(err => console.log('Error executing markReviewHelpful query', err))
};

module.exports = markReviewHelpful;
