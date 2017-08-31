const parseEmails = require('./parse_emails');

test('builds array of formatted object for one email', () => {
  const expected = [
    { email: 'foo@example.com' }
  ];

  expect(parseEmails('foo@example.com')).
    toEqual(expected);
});

test('builds array of formatted object for multiple emails', () => {
  const expected = [
    { email: 'foo@example.com' },
    { email: 'bar@example.com' }
  ];

  expect(parseEmails('foo@example.com, bar@example.com')).
    toEqual(expected);
});

test('returns empty array when non string value passed', () => {
  expect(parseEmails({})).toEqual([]);
});
