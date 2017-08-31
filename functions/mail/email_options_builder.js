'use strict';

const appendPixel = require('./pixel_appender');
const parseEmails = require('../../lib/parse_emails');


const emailOptionsBuilder = (opts) => {

  const body = appendPixel(opts.body, {
    mailing_id: opts.mailing_id,
    id: opts.id,
    email: opts.fromEmailAddress,
  });

  const cc = parseEmails(opts.ccEmailAddresses);

  let personalizations = {
    to: parseEmails(opts.toEmailAddresses),
    subject: opts.subject,
  };

  if(cc.length) {
    personalizations.cc = parseEmails(opts.ccEmailAddresses);
  }

  return {
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [personalizations],
      from: {
        email: opts.fromEmailAddress,
        name: opts.fromName,
      },
      content: [
        {
          type: 'text/html',
          value: body,
        }
      ]
    }
  };
};

module.exports = emailOptionsBuilder;
