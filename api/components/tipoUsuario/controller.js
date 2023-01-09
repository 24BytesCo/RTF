const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const TABLA = "tipoUsuario";
const TABLA_USUARIO = "usuario";
const autenticacionJwt = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");
const {
  validacionesParametrosRtf,
  validandoExistencia,
  validandoExistenciaConEstado,
} = require("../../../utils/validaciones");
module.exports = function (inyectedStore) {
  let store = require("../../../store/mysql");

  async function insert(body) {
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
    return await store.insert(TABLA, tipoUsuario);
  }

  async function getAll() {
    return await store.list(TABLA);
  }

  function get(id) {
    return store.get(TABLA, id);
  }

  return {
    insert,
    getAll,
    get
  };
};
