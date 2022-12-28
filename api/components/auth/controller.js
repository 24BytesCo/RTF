const bcrypt = require("bcrypt");
const TABLA = "autenticacion";
const TABLA_USUARIO = "usuario";
const autenticacionJwt = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");
const { decodificandoCabecera } = require("../../../seguridad/index");
module.exports = function (inyectedStore) {
  let store = inyectedStore || require("../../../store/mysql");

  //logeandonos en la app
  async function login(usuario, contrasenia) {
    const dataAth = await store.query(TABLA, { usuario: usuario });

    if (!dataAth) {
      throw new errorRtf("Datos de logueo inválidos", 401);
    }
    //Comparando contraseñas con seguridad
    return bcrypt
      .compare(contrasenia, dataAth.contrasenia)
      .then(async (result) => {
        //Evaluando comparación positiva
        if (result == true) {
          //Consultando datos del usuariio en la BD
          const dataUsuario = await store.query(TABLA_USUARIO, {
            id: dataAth.id,
          });

          const fechaHoy = new Date();
          //Generar Token
          return autenticacionJwt.ingreso({
            usuario: dataUsuario.usuario,
            id: dataUsuario.id,
            correoElectronico: dataUsuario.correoElectronico,
            primerNombre: dataUsuario.primerNombre,
            segundoNombre: dataUsuario.segundoNombre,
            primerApellido: dataUsuario.primerApellido,
            segundoApellido: dataUsuario.segundoApellido,
            ex: fechaHoy.setHours(3),
          });
        } else {
          throw new errorRtf("Datos de logueo inválidos", 401);
        }
      })
      .catch((err) => {
        throw new errorRtf("Datos de logueo inválidos", 401);
      });
  }
  async function verificar(req) {
    return decodificandoCabecera(req);
  }

  //Creando registro en tabla al crearse un nuevo Usuario
  async function insert(data) {
    const authData = {
      id: data.id,
      estado: data.estado,
    };
    if (data.usuario) {
      authData.usuario = data.usuario;
    }

    if (data.contrasenia) {
      //Encriptando la contraseña
      authData.contrasenia = await bcrypt.hash(data.contrasenia, 12);
    }

    return await store.insert(TABLA, authData);
  }
  return {
    insert,
    login,
    verificar,
  };
};
