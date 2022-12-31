const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const TABLA = "equipo";
const TABLA_TIPO_EQUIPO = "tipoEquipo";
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

    const equipo = {
      id: nanoid(),
      categoria: body.categoria,
      nombre: body.nombre,
      marca: body.marca,
      noSerie: body.noSerie,
      descripcion: body.descripcion,
      fechaAdquisionEmpresa: body.fechaAdquisionEmpresa,
      imagenArrayUrl: body.imagenArrayUrl,
      modelo: body.modelo,
      codigo: body.codigo,
      tipoEquipo: body.tipoEquipo,
      equipoPrincipal: body.equipoPrincipal,

      estado: 1,
    };

    validacionesParametrosRtf(equipo, ["descripcion", "codigo"]);
    await validandoExistenciaConEstado(TABLA, {
      codigo: equipo.codigo,
    });
    await validandoExistenciaConEstado(TABLA, {
      descripcion: equipo.descripcion,
    });

    return await store.insert(TABLA, equipo);
  }
  async function getAll() {
    return await store.list(TABLA);
  }

  async function getAllPrincipalesActivos() {
    //Consultando el id del tipo equipo Principal
    const tipoEquipo = await store.queryActivo(TABLA_TIPO_EQUIPO, { codigo: 'PRIN'});
    return await store.listEquiposActivosTipo(TABLA, tipoEquipo.id);
  }

  //Función para consultar un registro
  function get(id) {
    return store.get(TABLA, id);
  }

  return {
    insert,
    getAll,
    getAllPrincipalesActivos,
    get,
  };
};
