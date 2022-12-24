const seguridad = require("../../../seguridad");

module.exports = function verificandoPermisos(action) {
  function middleware(req, res, next) {
    switch (action) {
      case "update-usuario":
        const usuarioLogueado = req.body.id;
        seguridad.validando.datosLogueado(req, usuarioLogueado);

        next();

        break;

      default:
        next();
    }
  }

  return middleware;
};
