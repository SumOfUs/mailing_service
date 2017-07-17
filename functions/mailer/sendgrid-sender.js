"use strict";

const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY || "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");

const toArray = (string) => string.split(',').map((a) => a.trim());

const parseEmails = (addresses) => {
  return toArray(addresses).reduce( (item, memo) => {
    return memo.push({email: item})
  }, []);
};

exports.SendgridSender = (opts) => {
  let options = {
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: parseEmails(opts.toHeader),
          cc: parseEmails(opts.ccHeader),
          subject: opts.subject,
        }
      ],
      from: {
        email: opts.fromEmail,
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
