'use strict';

const toArray = (string) => string.split(',').map((a) => a.trim());

const parseEmails = (addresses) => {
  const addressesAsArray = toArray(addresses);
  return addressesAsArray.reduce( (memo, item) => {
    memo.push({email: item});
    return memo;
  }, []);
};

module.exports = parseEmails;
