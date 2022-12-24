const response = require("./response");

function error(err, req, res, next) {
  console.log("[ERROR]", err);

  var mensaje = err.message || "Ha ocurrido un error interno | EI01";

  if (mensaje == "invalid token") {
    mensaje = "Ha ocurrido un problema de seguridad | NS02";
  }
  if (mensaje == "invalid signature") {
    mensaje = "Ha ocurrido un problema de seguridad | NS03";
  }
  const estado = err.statusCode || 500;

  response.error(req, res, mensaje, estado);
}

module.exports = error;
