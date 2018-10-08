module.exports.handler = (event, content, callback) => {
  const body = JSON.parse(event.body);

  console.log(
    JSON.stringify(body, null, 2)
  );

  callback(null, {});
};
