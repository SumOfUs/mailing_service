"use strict";

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const appendPixel = (opts) => {
  let {body, mailing_id, user_id} = opts;

  const pixel = `<img src="http://example.com/open?mailing_id=${mailing_id}&user_id=${user_id}" />`;

  return `${body} ${pixel}`;
};

const send = (params, sender) => {
  sender.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.deliverEmail = (opts, sender) => {
  sender = (typeof sender !== 'undefined') ?  sender : new AWS.SES();

  const params = {
    Destination: {
      ToAddresses: [opts.to]
    },
    Message: {
      Body: {
        Html: {
          Data: appendPixel(opts)
        },
      },
      Subject: {
        Data: opts.subject
      }
   },
   Source: 'Tester <tester@example.com>'
  };

  send(params, sender);
};

exports.handle = (event, context, callback) => {
  let opts, data;

  event.Records.forEach( (record) => {
    data = record.dynamodb.NewImage;

    opts = {
      to: data.To.S,
      user_id: data.UserId.S,
      mailing_id: data.MailingId.S,
      subject: data.Subject.S,
      body: data.Body.S,
    }

    deliverEmail(opts);
  });

  callback(null, "message");
};

