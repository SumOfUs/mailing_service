'use strict';

const builder = require('./email_options_builder');
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const json = (data) => {
  JSON.stringify(data, null, 2)
};

const sendEmail = (opts) => {
  let options = builder(opts);
  let req = sendgrid.emptyRequest(options);

  sendgrid.API(req).
    then((response) => {
      console.log('SENDGRID::SUCCESS', json(response), json(options));
    }).catch((err) => {
      console.log('SENDGRID::ERROR', json(err), json(options));
    });
};

const processRecords = (events) => {
  events.forEach( (record) => {
    if(record.eventName !== 'INSERT') return;
    let data = record.dynamodb.NewImage;

    console.log(JSON.stringify(record, null, 6));

    let emailOptions = {
      body: data.Body.S,
      subject: (data.Subject || {}).S,
      toEmailAddresses: data.ToEmails.S,
      ccEmailAddresses: (data.CCEmails || {}).S,
      fromEmailAddress: data.FromEmail.S,
      fromName: data.FromName.S,
    };

    sendEmail(emailOptions);
  })
}

module.exports.handler = (event, content, callback) => {
  processRecords(event.Records);
  callback(null, {});
};
