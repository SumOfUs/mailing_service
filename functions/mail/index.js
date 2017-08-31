'use strict';

const builder = require('./email_options_builder');
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const sendEmail = (opts) => {
  let options = builder(opts);
  let req = sendgrid.emptyRequest(options);

  sendgrid.API(req).
    then((response) => {
      console.log('SENDGRID::SUCCESS', response, options);
    }).catch((err) => {
      console.log('SENGRID::ERROR', JSON.stringify(err, null, 2), options);
    });
};

const processRecords = (events) => {
  events.forEach( (record) => {
    if(record.eventName !== 'INSERT') return;
    let data = record.dynamodb.NewImage;

    let emailOptions = {
      id: data.id.S,
      body: data.body.S,
      subject: data.subject.S,
      toEmailAddresses: data.toEmailAddresses.S,
      ccEmailAddresses: (data.ccEmailAddresses || {}).S,
      fromEmailAddress: data.fromEmailAddress.S,
      fromName: data.fromName.S,
    };

    sendEmail(emailOptions);
  })
}

*body, *subject, *toEmailAddresses, ccEmailAddresses, *fromEmailAddress, *fromName

module.exports.handler = (event, content, callback) => {
  processRecords(event.Records);
  callback(null, {});
};
