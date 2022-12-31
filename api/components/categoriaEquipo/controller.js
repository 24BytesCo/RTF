const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const TABLA = "categoriaEquipo";
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

    const categoriaEquipo = {
      id: nanoid(),
      descripcion: body.descripcion,
      codigo: body.codigo,
      estado: 1,
    };

    validacionesParametrosRtf(categoriaEquipo, ["descripcion", "codigo"]);
    await validandoExistenciaConEstado(TABLA, {
      codigo: categoriaEquipo.codigo,
    });
    await validandoExistenciaConEstado(TABLA, {
      descripcion: categoriaEquipo.descripcion,
    });

    return await store.insert(TABLA, categoriaEquipo);
  }
  async function getAll() {
    return await store.listActivo(TABLA);
  }
  //Función para consultar un registro
  function get(id) {
    return store.get(TABLA, id);
  }

  return {
    insert,
    getAll,
    get,
  };
};
