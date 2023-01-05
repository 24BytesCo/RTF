const jwt = require("jsonwebtoken");
const config = require("../config");
const errorRtf = require("../utils/error");

const secreto = config.jwt.secreto;

function ingreso(datos) {
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

function verificandoPermisos(action) {
  function middleware(req, res, next) {
    const usuarioLogueado = req.body.id;
    const horaActual = new Date();




    switch (action) {
      case "update-usuario":
        validando.datosLogueado(req, usuarioLogueado);

        next();

        break;
      case "ver-hora-server":  
      
      decodificandoCabecera(req);

      next();

      case "verificar-token":  
      
      decodificandoCabecera(req);

      next();

      break;

      default:
        next();
    }
  }

  return middleware;
};

module.exports = {
  ingreso,
  validando,
  decodificandoCabecera,
  verificandoPermisos
};
