const { deliverEmail } = require('./index.js');

test('Sends email with correct message params', () => {
  const emailOpts = {
    to: 'test@example.com',
    user_id: '1234',
    mailing_id: 'abcd',
    subject: 'Hello',
    body: 'World'
  }

  const expectedArgs = {
    Destination: {
      ToAddresses: ['test@example.com']
    },
    Message: {
      Body: {
        Html: {
          Data: "World <img src=\"http://example.com/open?mailing_id=abcd&user_id=1234\" />"
        },
      },
      Subject: {
        Data: 'Hello'
      },
   },
   Source: 'Tester <tester@example.com>'
  };

  const sender = jest.fn();
  deliverEmail(emailOpts, { sendEmail: sender });

  expect(sender.mock.calls.length).toBe(1);
  expect(sender.mock.calls[0][0]).toEqual(expectedArgs);
});
