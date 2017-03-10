'use strict';

const UrlTracker = require('./url-tracker').UrlTracker;

exports.handle = function handle(e, ctx) {
  const query = e.queryStringParameters;
  const response = {
    statusCode: 302,
    headers: { location: query.url },
  };

  console.log(query.url);

  const tracker = ctx.tracker || new UrlTracker();
  tracker.track({ mailing_id: query.mailing_id, user_id: query.user_id, url: query.url })
    .then((data) => console.log('Successfully tracked url:', query, data),
      (error) => console.log('there was an error:', error, query))
    .then(() => ctx.succeed(response));
};

