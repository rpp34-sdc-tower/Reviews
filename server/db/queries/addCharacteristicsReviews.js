const pool = require('../index');

const addCharacteristicsReviews = (reviewId, characteristicId, value) => {
  let queryString = `INSERT INTO reviews_charateristics (characteristic_id, review_id, value) VALUES (${characteristicId}, ${reviewId}, ${value});`;

  return pool
    .query(queryString)
    .then(()=> {
      console.log('successfully added a characteristic value');
    })
    .catch(err => console.error('Error executing addCharacteristicsReviews query', err.stack))
};

module.exports = addCharacteristicsReviews;