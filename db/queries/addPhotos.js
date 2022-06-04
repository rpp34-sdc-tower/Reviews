const pool = require('../index');

const addPhotos = (reviewId, photos) => {
  let queryString = `
    INSERT INTO reviews_photos (review_id, url)
    SELECT * FROM UNNEST ($1::int[], $2::text[]) AS t (review_id, url);
    `;

  // return pool.connect().then((client) => {
  //   return client
  //     .query(queryString, [Array(photos.length).fill(reviewId), photos])
  //     .then((res) => {
  //       client.release();
  //       // console.log('insert photos into db');
  //     })
  //     .catch((err) => {
  //       client.release();
  //       console.log('Error executing addPhoto query: ', err);
  //     });
  // });

    return pool
    .query(queryString, [Array(photos.length).fill(reviewId), photos])
    .then((res)=> {
      return res;
    })
    .catch(err => console.log('Error executing addPhoto query', err))
};

module.exports = addPhotos;