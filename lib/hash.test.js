const hash = require('./hash');

test('returns a sha256', () => {
  const expected =  "0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914";
  const actual = hash('test', 'secret');

  expect(actual).
    toEqual(expected);
});
