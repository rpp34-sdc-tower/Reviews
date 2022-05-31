const pool = require('../index');

const getReviewsMetadata = (id) => {
  let ratingQueryString1 = `SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 1;`;
  let ratingQueryString2 = `SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 2;`;
  let ratingQueryString3 = `SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 3;`;
  let ratingQueryString4 = `SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 4;`;
  let ratingQueryString = `SELECT count(rating) from reviews WHERE product_id = ${id} and rating = 1;`;

  let recommendTrue = `SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = true;`;
  let recommendFalse = `SELECT count(recommend) from reviews WHERE product_id = ${id} and recommend = false;`;


  // return pool
  //   .query(queryString)
  //   .then((data)=> {
  //     console.log('data = ', data);
  //   })
  //   .catch(err => console.error('Error executing getReviewsMetadata query', err.stack))
};

module.exports = getReviewsMetadata;