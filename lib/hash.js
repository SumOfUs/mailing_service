'use strict';

const crypto = require('crypto');

const hash = (string, secret) => {
  if (typeof string !== 'string' || typeof secret !== 'string') {
    return false;
  }

  const hash = crypto.createHmac('sha256', secret)
                   .update(string)
                   .digest('hex');

  return hash;
};

module.exports = hash;
