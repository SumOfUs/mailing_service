const OpenTracker = require('./open-tracker').OpenTracker;

exports.handle = function handle(e, ctx) {
  const query = e.queryStringParameters;
  const response = {
    statusCode: 200,
    headers: { 'content-type': 'image/gif' },
    body: 'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  };

  const tracker = new OpenTracker();
  tracker.track({ mailing_id: query.mailing_id, user_id: query.user_id })
    .then((data) => {
      console.log('Successfully tracked:', query, data);
      ctx.succeed(response);
    }, (error) => {
      console.log('there was an error:', error, query);
      ctx.succeed(response);
    });
};
