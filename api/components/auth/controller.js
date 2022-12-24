const bcrypt = require("bcrypt");
const TABLA = "auth";
const TABLA_USUARIO = "user";
const autenticacionJwt = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");

module.exports = function (inyectedStore) {
  let store = inyectedStore || require("../../../store/bd-fake");

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

          //Generar Token
          return autenticacionJwt.ingreso({
            usuario: dataUsuario.usuario,
            id: dataUsuario.id,
            correoElectronico: dataUsuario.correoElectronico,
            primerNombre: dataUsuario.primerNombre,
            segundoNombre: dataUsuario.segundoNombre,
            primerApellido: dataUsuario.primerApellido,
            segundoApellido: dataUsuario.segundoApellido,
          });
        } else {
          throw new errorRtf("Datos de logueo inválidos", 401);
        }
      })
      .catch((err) => {
        throw new errorRtf("Datos de logueo inválidos", 401);
      });
  }

  //Creando registro en tabla al crearse un nuevo Usuario
  async function upSert(data) {
    const authData = {
      id: data.id,
    };
    if (data.usuario) {
      authData.usuario = data.usuario;
    }

    if (data.contrasenia) {
      //Encriptando la contraseña
      authData.contrasenia = await bcrypt.hash(data.contrasenia, 12);
    }

    return await store.upSert(TABLA, authData);
  }
  return {
    upSert,
    login,
  };
};
