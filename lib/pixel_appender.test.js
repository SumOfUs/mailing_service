const appendPixel = require('./pixel_appender');

test('appends url to pass text', () => {
  const expected = 'Hello world <img src="http://example.com?mailing_id=1&guid=2" />';

  expect(
    appendPixel("Hello world", {mailing_id: 1, guid: 2}, 'http://example.com')
  ).toEqual(expected);
});
