const pool = require('../index');

const getReviewsMetadata = (id) => {
  // let ratingsQueryString = `
  //   SELECT (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 1) as "1",
  //   (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 2) as "2",
  //   (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 3) as "3",
  //   (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 4) as "4",
  //   (SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 5) as "5";
  //   `;

  // let recommendQuery = `
  //   SELECT (SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = true) as true,
  //   (SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = false) as false;
  //   `;

  let metadataQuery = `
  select rMain.product_id,
        (
        select jsonb_agg(outerC) from
          (
          SELECT json_object_agg(r2.rating,
            (
            SELECT count(r1.rating)
            FROM reviews r1
            WHERE r1.product_id = rMain.product_id AND r1.rating = r2.rating
            )
          ) AS counts
        FROM reviews r2
        WHERE r2.product_id = rMain.product_id
        GROUP BY r2.rating) as outerC) as ratings,
        (
        select jsonb_agg(outerRecommendCounts) from
          (
          SELECT json_object_agg(r4.recommend,
            (
            SELECT count(r3.recommend)
            FROM reviews r3
            WHERE r3.product_id = rMain.product_id AND r3.recommend = r4.recommend
            )
          ) AS recommendCounts
        FROM reviews r4
        WHERE r4.product_id = rMain.product_id
        GROUP BY r4.recommend) as outerRecommendCounts
        ) as recommended,
        (
        select array_to_json(array_agg(characteristicGroup)) from
          (
          select c.characteristic_name, c.characteristic_id, avg(cr.value) as value
          from "characteristics" c
          inner join reviews_characteristics cr
          on c.characteristic_id = cr.characteristic_id
          where c.product_id = rMain.product_id
          group by c.characteristic_id
          ) characteristicGroup
        ) as characteristics
      from reviews rMain
      where rMain.product_id = ${id}
      group by rMain.product_id
      ;`;

  let transformMeta = (data) => {
    var transformedRatings = {};
    var transformedRecommend = {};
    var transformedCharacteristics = {};
    data[0].ratings.forEach(row => {
      transformedRatings = { ...transformedRatings, ...row.counts }
    });
    data[0].recommended.forEach(row => {
      transformedRecommend = { ...transformedRecommend, ...row.recommendcounts }
    });
    data[0].characteristics.forEach((row) => {
      transformedCharacteristics[row.characteristic_name] = {
        id: row.characteristic_id,
        value: row.value
      }
    });
    data[0].ratings = transformedRatings;
    data[0].recommended = transformedRecommend;
    data[0].characteristics = transformedCharacteristics;
    return data[0];
  }
  return pool
    .query(metadataQuery)
    .then((data) => {
      return transformMeta(data.rows);
    })
    .catch(err => console.error('Error executing getReviewsMetadata query', err.stack))
};

module.exports = getReviewsMetadata;