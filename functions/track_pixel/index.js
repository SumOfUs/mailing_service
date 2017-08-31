'use strict';

const hash = require('../../lib/hash')
const store = require('./store');

const trackerValid = (email, expected) => {
  return expected === hash(email, process.env.TRACKER_SECRET);
}

exports.handler = function handle(event, context, callback) {
  const query = event.queryStringParameters;

  const response = {
    statusCode: 302,
    headers: { location: 'https://s3.amazonaws.com/s.sumofus.org/pixel.gif' },
  };

  if (!query) {
    console.log('Could not read query parameters.')
  }

  const { mailing_id, email, id } = query || {};

  if( !trackerValid(email, id) ) {
    console.log('Invalid ID');
  } else {
    store(id, mailing_id);
  }

  // Return 302 no matter
  callback(null, response);
};
