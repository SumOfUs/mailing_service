"use strict";

const AWS = require('aws-sdk');
const isEqual = require('lodash/isEqual');
const cheerio = require('cheerio');

AWS.config.update({region: 'us-west-2'});

const appendPixel = (opts) => {
  const host = "https://ijjawanzea.execute-api.us-west-2.amazonaws.com/prod/track";
  const pixel = `<img src="${host}?mailing_id=${opts.mailing_id}&user_id=${opts.user_id}" />`;


  return `${opts.body} ${pixel}`;
};


const catchUrls = (text, url) => {
  const $ = cheerio.load(text);

  $('a').each((i, anchor) => {
    const current = $(anchor).attr('href');
    $(anchor).attr('href', `${url}?url=${current}`);
  });

  return $.html();
};

exports.catchUrls = catchUrls;

const send = (params, sender) => {
  sender.sendEmail(params, (err, data) => {
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
  const requiredParams = ['ToEmail', 'ToName', 'UserId', 'MailingId', 'Subject', 'Body', 'FromEmail', 'FromName'];
  const passedParams = record ? Object.keys(record) : [];
  return isEqual(requiredParams.sort(), passedParams.sort());
};

exports.hasRequiredParams = hasRequiredParams;

exports.handle = (event, context, callback) => {
  let opts, data, params;

  event.Records.forEach( (record) => {
    data = record.dynamodb.NewImage;
    console.log(JSON.stringify(record));

    if(hasRequiredParams(data)) {
      opts = {
        to: `${data.ToName.S} <${data.ToEmail.S}>`,
        from: `${data.FromName.S} <${data.FromEmail.S}>`,
        user_id: data.UserId.S,
        mailing_id: data.MailingId.S,
        subject: data.Subject.S,
        body: data.Body.S,
      };
      console.log(JSON.stringify(opts));
      deliverEmail(opts);
    }
  });

  callback(null, "message");
};
