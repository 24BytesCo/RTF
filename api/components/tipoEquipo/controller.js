const { nanoid } = require("nanoid");

const TABLA = "tipoEquipo";
const errorRtf = require("../../../utils/error");
const {
  validacionesParametrosRtf,
  validandoExistenciaConEstado,
} = require("../../../utils/validaciones");
module.exports = function (inyectedStore) {
  let store = require("../../../store/mysql");

  async function insert(body) {
    if (Object.entries(body).length == 0) {
      throw new errorRtf("Debes enviar un Body", 400);
    }

    const tipoEquipo = {
      id: nanoid(),
      descripcion: body.descripcion,
      codigo: body.codigo,
      estado: 1,
    };

    validacionesParametrosRtf(tipoEquipo, ["descripcion", "codigo"]);
    await validandoExistenciaConEstado(TABLA, {
      codigo: tipoEquipo.codigo,
    });
    await validandoExistenciaConEstado(TABLA, {
      descripcion: tipoEquipo.descripcion,
    });

    return await store.insert(TABLA, tipoEquipo);
  }
  async function getAll() {
    return await store.list(TABLA);
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
