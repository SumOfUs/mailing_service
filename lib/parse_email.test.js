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
    { email: 'bar@example.com' },
    { email: 'raa@example.com' }
  ];

  expect(parseEmails('foo@example.com;bar@example.com; raa@example.com')).
    toEqual(expected);
});

test('handles trailing semicolon', () => {
  const expected = [
    { email: 'foo@example.com' }
  ];

  expect(parseEmails('foo@example.com;')).
    toEqual(expected);
});

test('handles commas', () => {
  const expected = [
    { email: 'b, a <a.b@example.com>' }
  ];

  expect(parseEmails('b, a <a.b@example.com>')).
    toEqual(expected);
});

test('returns empty array when non string value passed', () => {
  expect(parseEmails({})).toEqual([]);
});
