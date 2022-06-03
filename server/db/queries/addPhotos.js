const pool = require('../index');

const addPhotos = (reviewId, photos) => {
  let queryString = `
    INSERT INTO reviews_photos (review_id, url)
    SELECT * FROM UNNEST ($1::int[], $2::text[]) AS t (review_id, url);
    `;

  // return pool
  //   .query(queryString, [Array(photos.length).fill(reviewId), photos])
  //   .then((res)=> {
  //     console.log('successfully added photos');
  //     return res;
  //   })
  //   .catch(err => console.error('Error executing addPhoto query', err.stack))

  return pool.connect().then((client) => {
    return client
      .query(queryString, [Array(photos.length).fill(reviewId), photos])
      .then((res) => {
        client.release();
        console.log('insert photos into db');
        return res;
      })
      .catch((err) => {
        client.release();
        console.log('DB PHOTOS INSERT ERROR: ', err);
      });
  });
};

module.exports = addPhotos;