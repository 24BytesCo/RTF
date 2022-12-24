const msgNoData = "No se han encontrado datos";
exports.success = function (req, res, message, status) {
  ///
  let statusCode = status || 200;
  let statusMessage = message || "";

  if (statusMessage) {
    res.status(status).send({
      error: false,
      status: statusCode,
      body: statusMessage,
    });
  } else {
    res.status(status).send({
      error: false,
      status: statusCode,
      body: msgNoData,
    });
  }
};

exports.error = function (req, res, message, status) {
  ///

  let statusCode = status || 500;
  let statusMessage = message || "Internal Server Error";

  res.status(status).send({
    error: true,
    status: statusCode,
    body: statusMessage,
  });
};
