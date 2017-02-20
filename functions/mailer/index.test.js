const { deliverEmail, hasRequiredParams } = require('./index.js');

test('Sends email with correct message params', () => {
  const emailOpts = {
    to: 'test@example.com',
    user_id: '1234',
    mailing_id: 'abcd',
    subject: 'Hello',
    body: 'World',
    from: 'Bob <from@example.com>',
  }

  const expectedArgs = {
    Destination: {
      ToAddresses: ['test@example.com']
    },
    Message: {
      Body: {
        Html: {
          Data: "World <img src=\"https://ijjawanzea.execute-api.us-west-2.amazonaws.com/prod/track?mailing_id=abcd&user_id=1234\" />"
        },
      },
      Subject: {
        Data: 'Hello'
      },
   },
   Source: 'Bob <from@example.com>',
  };

  const sender = jest.fn();
  deliverEmail(emailOpts, { sendEmail: sender });

  expect(sender.mock.calls.length).toBe(1);
  expect(sender.mock.calls[0][0]).toEqual(expectedArgs);
});


describe('Checks record has required params', () => {

  it('is false for an invalid record', () => {

    const invalidRecord = {
      foo: 'foo',
      bar: 'bar'
    };

    expect(hasRequiredParams(invalidRecord)).toBe(false);
  });

  it('is false for an invalid record', () => {

    const validRecord = {
      To: 'foo',
      Subject: 'bar',
      Body: 'body',
      UserId: '1',
      MailingId: '2',
      From: 'from',
    };

    expect(hasRequiredParams(validRecord)).toBe(true);
  });
});
