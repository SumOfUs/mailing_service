const processEvent = require('./index').processEvent;

test('iterates over recipients array', () => {
  const expected = [
    { email: 'foo@example.com' }
  ];

  expect(processEvent('foo@example.com')).
    toEqual(expected);
});
