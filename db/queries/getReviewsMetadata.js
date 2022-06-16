const pool = require('../index');

const getReviewsMetadata = (id) => {
  let metadataQuery = `
  SELECT rMain.product_id,
        (
        SELECT jsonb_agg(outerC) FROM
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
        GROUP BY r2.rating) AS outerC) AS ratings,
        (
        SELECT jsonb_agg(outerRecommendCounts) FROM
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
        GROUP BY r4.recommend) AS outerRecommendCounts
        ) AS recommended,
        (
        SELECT array_to_json(array_agg(characteristicGroup)) FROM
          (
          SELECT c.characteristic_name, c.characteristic_id, avg(cr.value) AS value
          FROM "characteristics" c
          inner join reviews_characteristics cr
          on c.characteristic_id = cr.characteristic_id
          WHERE c.product_id = rMain.product_id
          GROUP BY c.characteristic_id
          ) characteristicGroup
        ) AS characteristics
      FROM reviews rMain
      WHERE rMain.product_id = ${id}
      GROUP BY rMain.product_id
      ;`;

  let transformMeta = (data) => {
    var transformedRatings = {};
    var transformedRecommend = {};
    var transformedCharacteristics = {};
    if (data[0]) {
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
    } else {
      data[0] = {
        product_id: parseInt(id)
      }
    }
    return data[0];
  };

  return pool
    .query(metadataQuery)
    .then((data) => {
      return transformMeta(data.rows);
    })
    .catch(err => console.log('Error executing getReviewsMetadata query', err))
};

module.exports = getReviewsMetadata;