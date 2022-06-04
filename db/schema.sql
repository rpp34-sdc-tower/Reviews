CREATE DATABASE reviewsServer;

-- CREATE TABLE IF NOT EXISTS products(
--   product_id SERIAL PRIMARY KEY,
--   product_name VARCHAR(40)
-- );

CREATE TABLE IF NOT EXISTS reviews(
  review_id SERIAL PRIMARY KEY,
  product_id INT,
  rating INT,
  date bigint,
  summary VARCHAR,
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR,
  reviewer_email TEXT,
  response TEXT,
  helpfulness INT
);

CREATE TABLE IF NOT EXISTS reviews_photos(
  photo_id SERIAL PRIMARY KEY,
  review_id INT,
  url TEXT,
    CONSTRAINT fk_review
      FOREIGN KEY(review_id)
	      REFERENCES reviews(review_id)
);

CREATE TABLE IF NOT EXISTS characteristics(
  characteristic_id SERIAL PRIMARY KEY,
  product_id INT,
  characteristic_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS reviews_characteristics(
  id SERIAL PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
    CONSTRAINT fk_review
      FOREIGN KEY(review_id)
	      REFERENCES reviews(review_id),
  value INT,
  CONSTRAINT fk_characteristic
    FOREIGN KEY(characteristic_id)
	    REFERENCES characteristics(characteristic_id)
);

-- for login psql -U postgres
-- \l show all databases
-- \c move inside a database
-- \dt show tables in database
-- \d describe columns
-- control C exit