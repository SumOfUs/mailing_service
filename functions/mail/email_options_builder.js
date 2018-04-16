'use strict';

const parseEmails = require('../../lib/parse_emails');

const emailOptionsBuilder = (opts) => {
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
      categories: [opts.page],
      personalizations: [personalizations],
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
};

module.exports = emailOptionsBuilder;
