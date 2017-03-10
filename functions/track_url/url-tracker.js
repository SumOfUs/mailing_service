'use strict';

const AWS = require('aws-sdk');

const TABLE_NAME = 'UrlTracking';

exports.UrlTracker = class UrlTracker {
  constructor(client) {
    this.client = client || new AWS.DynamoDB.DocumentClient();
  }

  track(params) {
    return this.find(params).then(item => this.createOrUpdate(item, params));
  }

  find(params) {
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': `${params.mailing_id}:${params.user_id}`,
      },
    };

    console.log('query params:', queryParams);

    return new Promise((resolve, reject) => {
      this.client.query(queryParams, (error, data) => {
        if (error) {
          console.log('dynamodb.query error:', error);
          return reject(error);
        }
        return resolve(data.Items[0]);
      });
    });
  }

  createOrUpdate(item, params) {
    if (item) return this.update(item);
    return this.create(params);
  }

  create(params) {
    const time = new Date();
    return this.save({
      id: `${params.mailing_id}:${params.user_id}`,
      mailing_id: params.mailing_id,
      user_id: params.user_id,
      url:  params.url,
      first_clicked_at: time.toISOString(),
      last_clicked_at: time.toISOString(),
      clicks_count: 0,
    });
  }

  update(item) {
    const time = new Date();
    return this.save(Object.assign({}, item, {
      clicks_count: item.clicks_count + 1,
      last_opened_at: time.toISOString(),
    }));
  }

  save(item) {
    return new Promise((resolve, reject) => {
      this.client.put({ TableName: TABLE_NAME, Item: item }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
};
