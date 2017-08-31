'use strict';
const AWS = require('aws-sdk');
const tableName = process.env.OPEN_TRACKING_TABLE;
const client = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});

const store = (id, mailing_id) => {
  console.log(process.env.URL);
  const time = new Date();

  const params = {
    TableName: tableName,
    Key: {
      id: id,
      mailing_id: mailing_id,
    },

    ExpressionAttributeNames: {
      '#last': 'last_opened_at',
      '#first': 'first_opened_at',
      '#open_count': 'open_count'
    },

    UpdateExpression: "SET #first = if_not_exists(#first, :time), #last = :time ADD #open_count :incr_amount",

    ExpressionAttributeValues:{
      ':incr_amount': 1,
      ":time": time.toISOString(),
    },
  };

  client.update(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

module.exports = store;
