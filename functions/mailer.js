'use strict';

const AWS = require("aws-sdk");
const striptags = require('striptags');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const parseName = name => name.replace(/[^\w\s]/g, ' ');

const htmlToText = html => {
  let text;

  text = html.replace(/<p><br><\/p>/g, '');
  text = striptags(text, ['p']);
  text = striptags(text, [], '\n');
  return text;
}

const processEvent = (data, cb) => {
  const emailOpts = {
    to: data.Recipients,
    from: data.Sender,
    categories: [data.Slug],
    subject: data.Subject,
    text: htmlToText(data.Body),
    html: data.Body,
    customArgs: {
      mailing_id: data.MailingId
    },
    trackingSettings: {
      clickTracking: {
        enable: true
      },
      openTracking: {
        enable: true
      },
    },
  };

  sendgrid.
    send(emailOpts).
    then( resp => {
      console.log('success', resp)
      cb(null, {});
    }).
    catch( err => {
      console.log('ERROR', err);
      cb(null, {});
    });
}

module.exports.handler = (event, content, callback) => {
  const record = event.Records[0];

  const parsedRecord = AWS.DynamoDB
    .Converter
    .unmarshall(record.dynamodb.NewImage);


  if(record.eventName === 'INSERT') processEvent(parsedRecord, callback);
};
