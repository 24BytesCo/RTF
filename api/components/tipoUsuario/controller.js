const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const TABLA = "tipoUsuario";
const TABLA_USUARIO = "user";
const autenticacionJwt = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");
const {
  validacionesParametrosRtf,
  validandoExistencia,
  validandoExistenciaConEstado,
} = require("../../../utils/validaciones");
module.exports = function (inyectedStore) {
  let store = inyectedStore || require("../../../store/bd-fake");

  async function upSert(body) {
    if (Object.entries(body).length == 0) {
      throw new errorRtf("Debes enviar un Body", 400);
    }

    const tipoUsuario = {
      id: nanoid(),
      descripcion: body.descripcion,
      codigo: body.codigo,
      estado: 1,
    };

    validacionesParametrosRtf(tipoUsuario, ["descripcion", "codigo"]);

    //Validando la no existencia de éstas propiedades en la BD
    await validandoExistenciaConEstado(TABLA, { codigo: tipoUsuario.codigo });
    await validandoExistenciaConEstado(TABLA, {
      descripcion: tipoUsuario.descripcion,
    });
    console.log("tipoUsuario", tipoUsuario);
    return await store.upSert(TABLA, tipoUsuario);
  }

  return {
    upSert,
  };
};
