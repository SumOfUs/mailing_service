"use strict";

const AWS = require('aws-sdk');
const isEqual = require('lodash/isEqual');
const cheerio = require('cheerio');

AWS.config.update({region: 'us-west-2'});

// Move values to ENV
const pixelTrackingHost = "https://jeaipw2gm6.execute-api.us-west-2.amazonaws.com/dev/pixel";
const urlTrackingHost = "https://jeaipw2gm6.execute-api.us-west-2.amazonaws.com/dev/urltrack";

const appendPixel = (body, opts, host) => {
  const pixelImage = `<img src="${host}?mailing_id=${opts.mailing_id}&user_id=${opts.user_id}" />`;

  return `${body} ${pixelImage}`;
};

const catchUrls = (body, opts, host) => {
  const $ = cheerio.load(body);

  $('a').each((i, anchor) => {
    const current = encodeURIComponent($(anchor).attr('href'));
    $(anchor).attr('href', `${host}?url=${current}&mailing_id=${opts.mailing_id}&user_id=${opts.user_id}`);
  });

  return $.html();
};

exports.catchUrls = catchUrls;

const send = (params, sender) => {
  sender.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

const insertSalutations = (body, opts) => {
  body = `<p>Dear ${opts.toName},</p>${body}<p>Regards,<br/>${opts.fromName}</p>`
  return body;
};

const setupBody = (opts) => {
  let body = opts.body;

  body = catchUrls(body, opts, urlTrackingHost);
  body = insertSalutations(body, opts);
  body = appendPixel(body, opts, pixelTrackingHost);

  return body;
};

const deliverEmail = (opts, sender) => {
  sender = (typeof sender !== 'undefined') ?  sender : new AWS.SES();

  const params = {
    Destination: {
      ToAddresses: [opts.to]
    },
    Message: {
      Body: {
        Html: {
          Data: setupBody(opts)
        },
      },
      Subject: {
        Data: opts.subject
      }
   },
   Source: opts.from,
   ReplyToAddresses: opts.replyToAddresses,
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
        toName: data.ToName.S,
        from: `${data.FromName.S} <omar@sumofus.org>`,
        fromName: data.FromName.S,
        replyToAddresses: [`${data.FromName.S} <${data.FromEmail.S}>`, "SumOfUs <omar@sumofus.org>"],
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
