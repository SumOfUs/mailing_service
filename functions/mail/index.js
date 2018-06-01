'use strict';

const builder = require('./email_options_builder');
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const sendEmail = opts => {
  let options = builder(opts);
  let req = sendgrid.emptyRequest(options);

  sendgrid.API(req)
    .catch( err => console.log(err.response.body));
};

const processEvent = record => {
  const data = record.dynamodb.NewImage;

  const emailOptions = {
    body: data.Body.S,
    subject: (data.Subject || {}).S,
    fromEmailAddress: data.FromEmail.S,
    fromName: data.FromName.S,
    page: data.MailingId.S.split(':')[0],
  };

  const toEmails = data.ToEmails.L;

  for (let contact of toEmails) {
    emailOptions.toEmailAddress = contact.S;
    sendEmail(emailOptions);
  };
};

module.exports.handler = (event, content, callback) => {
  const record = event.Records[0];
  if(record.eventName === 'INSERT') processEvent(record);

  // shouldn't respond with error, else
  // event will be replayed, potentially sending multiple emails
  // to each recipient, when multiple recipients are passed.
  // FIX: could have an intermediary process that listens to the DynamoDB stream
  // and posts individual messages to an SNS topic (one for each recipient). The email
  // sender would subscribe to that topic.
  callback(null, {});
};
