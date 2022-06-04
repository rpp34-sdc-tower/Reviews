const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');
const csvFolder = path.join('../reviews_csv');

const inputFile = csvFolder + '/testreviews.csv';
const outputFile = csvFolder + '/cleantestReviews.csv';

(async function () {

  const writeStream = fs.createWriteStream(outputFile);

  const parse = csv.parse(
    {
      headers: ['id', 'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response', 'helpfulness'],
    });

  const transform = csv.format({ headers: true, writeHeaders: false})
    .transform((row) => {
      var formattedDate;
      if (row.date !== 'date') {
        var date = parseInt(row.date);
        formattedDate = new Date(date).toISOString();
      }

      return {
        id: row.id,
        product_id: row.product_id,
        rating: row.rating,
        date: formattedDate,
        summary: row.summary,
        body: row.body,
        recommend: row.recommend,
        reported: row.reported,
        reviewer_name: row.reviewer_name,
        // reviewer_email: row.reviewer_email,
        response: row.response,
        helpfulness: row.helpfulness
      }
    });

  const stream = fs.createReadStream(inputFile)
    .pipe(parse)
    .pipe(transform)
    .pipe(writeStream);
})();
