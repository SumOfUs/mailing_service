'use strict';

const toArray = (string) => string.
  split(',').
  map((a) => a.trim()).
  filter((a) => a !== '')


const notString = (string) => typeof string !== 'string';

const parseEmails = (addresses) => {
  if(notString(addresses)) return [];
  const addressesAsArray = toArray(addresses);
  return addressesAsArray.reduce( (memo, item) => {
    memo.push({email: item});
    return memo;
  }, []);
};

module.exports = parseEmails;
