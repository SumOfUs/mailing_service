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
    if(!data.Subject) return;
    console.log(JSON.stringify(record, null, 6));

    // MailingId: "#{opts[:page_slug]}:#{Time.now.to_i}",
    //                          UserId: opts[:from_email],
    //                          Body: simple_format(opts[:body]),
    //                          Subject: opts[:subject],
    //                          ToEmails: opts[:to_emails],
    //                          FromName: opts[:from_name],
    //                          FromEmail: opts[:from_email],
    //                          ReplyTo: opts[:reply_to],

    let emailOptions = {
      body: data.Body.S,
      subject: data.Subject.S,
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
