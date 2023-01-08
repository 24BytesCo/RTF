const { nanoid } = require("nanoid");

const TABLA = "caso";
const TABLA_ESTADO_CASO = "estadosCaso";
const TABLA_EQUIPO = "equipo";
const TABLA_USUARIO = "usuario";
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

    var caso = {
      tecnicoAsignado: null,
      equipoRelacionado: body.equipoRelacionado,
      usuarioReporta: body.usuarioReporta,
      fechaCreacion: new Date(),
      observacionInicial: body.observacionInical,
      estadoCaso: null,
      estado: 1,
    };

    validacionesParametrosRtf(caso, [
      "equipoRelacionado",
      "usuarioReporta",
      "observacionInicial",
    ]);

    //Validando si ya existe un caso con el código de estado diferente de SOLUCIONADO (SOL)
    const casoBD = await store.queryActivoCasoEstadoCasoDiferenteDe("SOL");

    if(casoBD){
      console.log("casoBD", casoBD);
      const casoEncontradoBD = await store.queryActivo(TABLA_ESTADO_CASO, { id: casoBD.estadoCaso });
      throw new errorRtf("El equipo relacionado ya tiene un caso en estado "+ casoEncontradoBD.descripcion, 400);

    }

    

    //Obteniendo el estado del caso inicial REPORTADO

    const [estadoReportado, usuario, equipo] = await Promise.all([await store.queryActivo(TABLA_ESTADO_CASO, {codigo: "REP"}), await store.queryActivo(TABLA_USUARIO, {id: caso.usuarioReporta}), await store.queryActivo(TABLA_EQUIPO, {id: caso.equipoRelacionado}) ]);


    if (!estadoReportado) {
      throw new errorRtf("No se encontró automáticamente el estado del caso", 400);
    }

    if (!usuario) {
      throw new errorRtf("El usuario que reporta no existe o no está activo", 400);
    }

    if (!equipo) {
      throw new errorRtf("El equipo relacionado al caso no existe o no está activo", 400);
    }

    caso.estadoCaso = estadoReportado.id;


    return await store.insert(TABLA, caso);
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
