'use strict';

const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const sendEmail = (opts) => {
  let options = {
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: parseEmails(opts.toEmailAddresses),
          cc: parseEmails(opts.ccEmailAddresses),
          subject: opts.subject,
        }
      ],
      from: {
        email: opts.fromEmailAddress,
        name: opts.fromName,
      },
      content: [
        {
          type: 'text/html',
          value: opts.body,
        }
      ]
    }
  };

  let req = sendgrid.emptyRequest(options);

  sendgrid.API(req).
    then((response) => {
      console.log('SENDGRID::SUCCESS', response, options);
    }).catch((err) => {
      console.log('SENGRID::ERROR', err, options);
    });
};

const processRecord = (events) => {
  events.forEach( (record) => {
    if(record.eventName !== 'INSERT') return;
    let data = record.dynamodb.NewImage;

    sendEmail({
      body: data.body.S,
      subject: data.subject.S,
      toEmailAddresses: data.toEmailAddresses.S,
      ccEmailAddresses: data.ccEmailAddresses.S,
      fromEmailAddress: data.fromEmailAddress.S,
      fromName: data.fromName.S,
    })
  })
}

module.exports.handler = (event, content, callback) => {
  console.log(JSON.stringify(event, null, 2));
  processRecords(event.Records);
  callback(null, {});
};
