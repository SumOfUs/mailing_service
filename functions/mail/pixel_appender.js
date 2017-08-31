'use strict';

const appendPixel = (body, opts, endpoint=process.env.PIXEL_URL) => {
  const pixelImage = `<img height="1" width="1" border="0" src="${endpoint}?email=${opts.email}&mailing_id=${opts.mailing_id}&id=${opts.id}" />`;

  console.log("PIXEL IMAGE", pixelImage);
  return `${body} ${pixelImage}`;
};

module.exports = appendPixel;
