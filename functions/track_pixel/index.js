'use strict';

const PixelTracker = require('./pixel-tracker').PixelTracker;

exports.handle = function handle(e, ctx) {
  const query = e.queryStringParameters;
  const response = {
    statusCode: 302,
    headers: { location: 'https://s3.amazonaws.com/s.sumofus.org/pixel.gif' },
  };

  const tracker = ctx.tracker || new PixelTracker();
  tracker.track({ mailing_id: query.mailing_id, user_id: query.user_id })
    .then((data) => {
      console.log('Successfully tracked:', query, data);
      ctx.succeed(response);
    }, (error) => {
      console.log('there was an error:', error, query);
      ctx.succeed(response);
    });
};
