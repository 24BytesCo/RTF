const jwt = require("jsonwebtoken");
const config = require("../config");
const errorRtf = require("../utils/error");

const secreto = config.jwt.secreto;
function ingreso(datos) {
  console.log("datos", datos);
  return jwt.sign(datos, secreto);
}

const validando = {
  datosLogueado: function (req, usuarioLogueado) {
    const tokenDecodificado = decodificandoCabecera(req);
    if (tokenDecodificado.id != usuarioLogueado) {
      throw new errorRtf("No tienes permiso para realizar ésta acción", 403);
    }

    //
  },
};

function obtenerToken(autorizacion) {
  //Bearer werwert23rdsarfwefasdf23rs
  console.log("autorizacion", autorizacion);
  if (!autorizacion) {
    throw new errorRtf(
      "Ha ocurrido un problema con la autorización | NT01",
      412
    );
  }

  if (autorizacion.indexOf("Bearer ") == -1) {
    throw new errorRtf(
      "Ha ocurrido un problema con la autorización | NT02",
      412
    );
  }

  let token = autorizacion.replace("Bearer ", "");

  return token;
}

function verificandoToken(token) {
  if (!secreto) {
    throw new errorRtf("Ha ocurrido un problema de seguridad | NS01", 424);
  }
  return jwt.verify(token, secreto);
}

function decodificandoCabecera(req) {
  const autorizacion = req.headers.authorization || "";
  const token = obtenerToken(autorizacion);

  const tokenValido = verificandoToken(token);

  return (req.user = tokenValido);
}

module.exports = {
  ingreso,
  validando,
};
