"use strict";

const AWS = require('aws-sdk');
const isEqual = require('lodash/isEqual');

AWS.config.update({region: 'us-west-2'});

const appendPixel = (opts) => {
  const host = "https://ijjawanzea.execute-api.us-west-2.amazonaws.com/prod/track";
  const pixel = `<img src="${host}?mailing_id=${opts.mailing_id}&user_id=${opts.user_id}" />`;


  return `${opts.body} ${pixel}`;
};

const send = (params, sender) => {
  sender.sendEmail(params, (err, data) => {
    console.log("email sent!!!!", err, data);

    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

const deliverEmail = (opts, sender) => {
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
   Source: opts.from
  };

  send(params, sender);
};

exports.deliverEmail = deliverEmail;

const hasRequiredParams = (record) => {
  const requiredParams = ['To', 'UserId', 'MailingId', 'Subject', 'Body', 'From'];
  const passedParams = record ? Object.keys(record) : [];
  return isEqual(requiredParams.sort(), passedParams.sort());
};

exports.hasRequiredParams = hasRequiredParams;

exports.handle = (event, context, callback) => {
  let opts, data, params;

  event.Records.forEach( (record) => {
    data = record.dynamodb.NewImage;

    if(hasRequiredParams(data)) {
      opts = {
        to: data.To.S,
        user_id: data.UserId.S,
        mailing_id: data.MailingId.S,
        subject: data.Subject.S,
        body: data.Body.S,
        from: data.From.S,
      }

      deliverEmail(opts);
    }
  });

  callback(null, "message");
};
