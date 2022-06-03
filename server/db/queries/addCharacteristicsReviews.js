const pool = require('../index');

const addCharacteristicsReviews = (reviewId, characteristicsObj) => {
  let queryString = `
    INSERT INTO reviews_characteristics (characteristic_id, review_id, value)
    SELECT * FROM UNNEST ($1::int[], $2::int[], $3::int[]) AS t (characteristic_id,review_id, value);
    `;

  // return pool
  //   .query(queryString)
  //   .then(()=> {
  //     console.log('successfully added a characteristic value');
  //   })
  //   .catch(err => console.error('Error executing addCharacteristicsReviews query', err.stack))

  return pool.connect().then((client) => {
    return client
      .query(queryString, [Object.keys(characteristicsObj), Array(Object.keys(characteristicsObj).length).fill(reviewId), Object.values(characteristicsObj)])
      .then((res) => {
        client.release();
        console.log('insert characteristic values into db');
      })
      .catch((err) => {
        client.release();
        console.log('Error executing addCharacteristicsReviews query: ', err);
      });
  });
};

module.exports = addCharacteristicsReviews;