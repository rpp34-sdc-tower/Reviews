const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = 'mongodb://localhost/SDC';
mongoose.connect(uri);

const reviewsSchema = new Schema {
  _id: Number,
  product_id: String,
  review_id: Number,
  summary: String,
  body: String,
  data: Data,
  recommend: Boolean,
  report: Boolean,
  reviewer_name: String,
  helpfulness: Number,
  rating: Number,
  photo: [{type: ObjectId, ref: 'photo'}]
};

const photosSchema = new Schema {
  _id: Number,
  photo_id: Number,
  url: String,
  review_id: {type: ObjectId, ref: 'review'}
};

const characteristicsSchema = new Schema {
  _id: Number,
  characteristic_id: Number,
  value: Number,
  review_id: {type: ObjectId, ref: 'review'}
};

const reviewsMetadataSchema = new Schema {
  _id: Number,
  product_id: Number,
  ratings: Object,
  recommend: Object,
  characteristics: {type: ObjectId, ref: 'characteristic'}
};

const characteristicReivewsSchema = new Schema {
  _id: Number,
  product_id: String,
  ratings: Object,
  recommended: Object,
  characteristics: {type: ObjectId, ref: 'characteristic'}
};

const reviews = mongoose.model('reviews', reviewsSchema);
const photos = mongoose.model('photos', photosSchema);
const characteristics = mongoose.model('photos', characteristicsSchema);
const reviewMetadata = mongoose.model('reviewMetadata', reviewsMetadataSchema);
const characteristicReivews = mongoose.model('characteristicReivews', characteristicReivewsSchema);
