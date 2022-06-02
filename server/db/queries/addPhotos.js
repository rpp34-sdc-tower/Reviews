const pool = require('../index');

const addPhoto = (reviewId, url) => {
  let queryString = `
    INSERT INTO reviews_photos (product_id, url)
    VALUES (${reviewId}, ${url});`;

  return pool
    .query(queryString)
    .then(()=> {
      console.log('successfully added a photo');
    })
    .catch(err => console.error('Error executing addPhoto query', err.stack))
};

module.exports = addPhoto;