const { nanoid } = require("nanoid");

const TABLA = "caso";
const TABLA_ESTADO_CASO = "estadosCaso";
const TABLA_EQUIPO = "equipo";
const TABLA_TIPO_USUARIO = "tipoUsuario";
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
      observacionInicial: body.observacionInicial,
      estadoCaso: null,
      estado: 1,
    };

    validacionesParametrosRtf(caso, [
      "equipoRelacionado",
      "usuarioReporta",
      "observacionInicial",
    ]);

    //Validando si ya existe un caso con el código de estado diferente de SOLUCIONADO (SOL)
    const casoBD = await store.queryActivoCasoEstadoCasoDiferenteDe(
      caso.equipoRelacionado,
      "SOL"
    );

    if (casoBD) {
      console.log("casoBD", casoBD);
      const casoEncontradoBD = await store.queryActivo(TABLA_ESTADO_CASO, {
        id: casoBD.estadoCaso,
      });
      throw new errorRtf(
        "El equipo relacionado ya tiene un caso en estado " +
          casoEncontradoBD.descripcion,
        400
      );
    }

    //Obteniendo el estado del caso inicial REPORTADO

    const [estadoReportado, usuario, equipo] = await Promise.all([
      await store.queryActivo(TABLA_ESTADO_CASO, { codigo: "REP" }),
      await store.queryActivo(TABLA_USUARIO, { id: caso.usuarioReporta }),
      await store.queryActivo(TABLA_EQUIPO, { id: caso.equipoRelacionado }),
    ]);

    if (!estadoReportado) {
      throw new errorRtf(
        "No se encontró automáticamente el estado del caso",
        400
      );
    }

    if (!usuario) {
      throw new errorRtf(
        "El usuario que reporta no existe o no está activo",
        400
      );
    }

    if (!equipo) {
      throw new errorRtf(
        "El equipo relacionado al caso no existe o no está activo",
        400
      );
    }

    caso.estadoCaso = estadoReportado.id;

    return await store.insert(TABLA, caso);
  }

  async function getAll() {
    let listaMapeada = [];

    var casosBd = await store.listActivo(TABLA);

    for (let index = 0; index < casosBd.length; index++) {
      var element = casosBd[index];

      element = JSON.parse(JSON.stringify(element));

      var [equipoRelacionado, usuarioReporta, tecnicoAsignado, estadoCaso] =
        await Promise.all([
          await store.get(TABLA_EQUIPO, element.equipoRelacionado),
          store.get(TABLA_USUARIO, element.usuarioReporta),
          await store.get(TABLA_USUARIO, element.tecnicoAsignado),
          await store.get(TABLA_ESTADO_CASO, element.estadoCaso),
        ]);

      equipoRelacionado = JSON.parse(JSON.stringify(equipoRelacionado))[0];
      usuarioReporta = JSON.parse(JSON.stringify(usuarioReporta))[0];
      tecnicoAsignado = JSON.parse(JSON.stringify(tecnicoAsignado))[0];
      estadoCaso = JSON.parse(JSON.stringify(estadoCaso))[0];

      const casoRetorno = {
        numeroCaso: element.numeroCaso,
        estadoCasoCode: estadoCaso.codigo,
        estadoCasoDescripcion: estadoCaso.descripcion,
        tecnicoAsignadoNombreCompleto: !tecnicoAsignado
          ? null
          : (
              tecnicoAsignado.primerNombre +
              " " +
              tecnicoAsignado.segundoNombre +
              " " +
              tecnicoAsignado.primerApellido +
              " " +
              tecnicoAsignado.segundoApellido
            )
              .replace("  ", " ")
              .replace("null", "")
              .replace("  ", " "),
        tecnicoAsignadoId: !tecnicoAsignado ? null : tecnicoAsignado.id,
        usuarioReportaNombreCompleto: (
          usuarioReporta.primerNombre +
          " " +
          usuarioReporta.segundoNombre +
          " " +
          usuarioReporta.primerApellido +
          " " +
          usuarioReporta.segundoApellido
        )
          .replace("  ", " ")
          .replace("null", "")
          .replace("  ", " "),
        usuarioReportaId: usuarioReporta.id,
        equipoRelacionado:
          equipoRelacionado.nombre + " | " + equipoRelacionado.codigo,
        fechaCreacionString: new Date(
          element.fechaCreacion
        ).toLocaleDateString(),
        observacionInicial: element.observacionInicial,
      };

      listaMapeada.push(casoRetorno);
    }

    return listaMapeada;
  }

  async function getOne(numeroCaso) {
    let listaMapeada = [];

    var element = await store.getConNumeroDeCaso(TABLA, numeroCaso);

    if (!element) {
      return;
    }

    element = JSON.parse(JSON.stringify(element));

    var [equipoRelacionado, usuarioReporta, tecnicoAsignado, estadoCaso] =
      await Promise.all([
        await store.get(TABLA_EQUIPO, element.equipoRelacionado),
        store.get(TABLA_USUARIO, element.usuarioReporta),
        await store.get(TABLA_USUARIO, element.tecnicoAsignado),
        await store.get(TABLA_ESTADO_CASO, element.estadoCaso),
      ]);

    equipoRelacionado = JSON.parse(JSON.stringify(equipoRelacionado))[0];
    usuarioReporta = JSON.parse(JSON.stringify(usuarioReporta))[0];
    tecnicoAsignado = JSON.parse(JSON.stringify(tecnicoAsignado))[0];
    estadoCaso = JSON.parse(JSON.stringify(estadoCaso))[0];

    const casoRetorno = {
      numeroCaso: element.numeroCaso,
      estadoCasoCode: estadoCaso.codigo,
      estadoCasoDescripcion: estadoCaso.descripcion,
      tecnicoAsignadoNombreCompleto: !tecnicoAsignado
        ? null
        : (
            tecnicoAsignado.primerNombre +
            " " +
            tecnicoAsignado.segundoNombre +
            " " +
            tecnicoAsignado.primerApellido +
            " " +
            tecnicoAsignado.segundoApellido
          )
            .replace("  ", " ")
            .replace("null", "")
            .replace("  ", " "),
      tecnicoAsignadoId: !tecnicoAsignado ? null : tecnicoAsignado.id,
      usuarioReportaNombreCompleto: (
        usuarioReporta.primerNombre +
        " " +
        usuarioReporta.segundoNombre +
        " " +
        usuarioReporta.primerApellido +
        " " +
        usuarioReporta.segundoApellido
      )
        .replace("  ", " ")
        .replace("null", "")
        .replace("  ", " "),
      usuarioReportaId: usuarioReporta.id,
      equipoRelacionado:
        equipoRelacionado.nombre + " | " + equipoRelacionado.codigo,
      fechaCreacionString: new Date(element.fechaCreacion).toLocaleDateString(),
      observacionInicial: element.observacionInicial,
      imagenPrincipalEquipoSeleccionado: equipoRelacionado.imagenPrincipal,
    };

    return casoRetorno;
  }

  //Función para consultar un registro
  function get(id) {
    return store.get(TABLA, id);
  }

  //Función para consultar un registro
  async function getConNumerocaso(id) {
    return await store.getConNumeroDeCaso(TABLA, id);
  }

  async function getAllConteoTotalActivos() {
    //Consultando el id del tipo equipo Principal
    return await store.queryConteoActivoNumeroCaso(TABLA);
  }

  async function asignarTecnico(body) {
    if (Object.entries(body).length == 0) {
      throw new errorRtf("Debes enviar un Body", 400);
    }

    var asignarTecnico = {
      idCaso: body.idCaso,
      idTecnico: body.idTecnico,
    };

    validacionesParametrosRtf(asignarTecnico, ["idCaso", "idTecnico"]);

    //Validaciones

    //Validando que el usuario exista, que sea un tecnico y que no esté asignado a otro caso.

    const usuarioTecnico = await store.queryActivo(TABLA_USUARIO, {
      id: asignarTecnico.idTecnico,
    });

    if (!usuarioTecnico) {
      throw new errorRtf("El usuario proporcionado no existe", 400);
    }

    const tipoUsuario = await store.queryActivo(TABLA_TIPO_USUARIO, {
      id: usuarioTecnico.tipoUsuario,
    });

    console.log("tipoUsuario", tipoUsuario);

    if (tipoUsuario.codigo != "TEC") {
      throw new errorRtf("El usuario proporcionado no es un técnico", 400);
    }

    var tecnicoOcupado =
    await store.queryActivoCasoEstadoTecnicoCasoDiferenteDe(
      asignarTecnico.idTecnico,
      "SOL"
    );

    console.log("tecnicoOcupado", tecnicoOcupado);

    if (tecnicoOcupado != null) {
      throw new errorRtf("El usuario proporcionado ya está asignado en un caso no solucionado", 400);
    }

    return await store.updateCasoAgregaTecnico(TABLA, asignarTecnico);
  }

  return {
    insert,
    getAll,
    get,
    getAllConteoTotalActivos,
    getConNumerocaso,
    getOne,
    asignarTecnico,
  };
};
