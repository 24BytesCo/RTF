const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const TABLA = "equipo";
const TABLA_TIPO_EQUIPO = "tipoEquipo";
const TABLA_CARTEGORIA_EQUIPO = "categoriaEquipo";
const autenticacionJwt = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");
const {
  validacionesParametrosRtf,
  validandoExistencia,
  validandoExistenciaConEstado,
} = require("../../../utils/validaciones");
const equipo = require(".");
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
  async function getAll(req) {
    const desde = Number(req.query.desdeRegistro) || 0;
    const hasta = Number(req.query.cantidadPorPagina) || 5;
    const nombre = req.query.nombre;

    let listaMapeada = [];
    let general = null;

    if (nombre && nombre != "null") {
      general = await store.listActivoPaginadoNombreLike(
        TABLA,
        nombre,
        desde,
        hasta
      );
      general.push(
        await store.listActivoPaginadoMarcaLike(TABLA, nombre, desde, hasta)
      );

      const dataArr = new Set(general);

      general = [...dataArr];
    } else {
      general = await store.listActivoPaginado(TABLA, desde, hasta);
    }
    async function mapeoManualRow() {


        for (let i = 0; i < general.length; i++) {
          var item =  general[i];
          item = Object.values(JSON.parse(JSON.stringify(item)));
          item = item[i];

          const [tipoEquipo, categoria, equipoPrincipal] = await Promise.all([
            await store.get(TABLA_TIPO_EQUIPO, item.tipoEquipo),
            store.get(TABLA_CARTEGORIA_EQUIPO, item.categoria),
            (await store.get(TABLA, item.equipoPrincipal)) || null,
          ]);

          

          const equipo = {
            id: item.id,
            categoria: {
              descripcion: categoria[0]?.descripcion ?? null,
              codigo: categoria[0]?.codigo ?? null,
            },
            nombre: item.nombre,
            marca: item.marca,
            noSerie: item.noSerie,
            descripcion: item.descripcion,
            fechaAdquisionEmpresa: item.fechaAdquisionEmpresa,
            tipoEquipo: {
              descripcion: tipoEquipo[0]?.descripcion ?? null,
              codigo: tipoEquipo[0]?.codigo ?? null,
            },
            equipoPrincipal: {
              id: equipoPrincipal[0]?.id ?? null,
              nombre: equipoPrincipal[0]?.nombre ?? null,
              codigo: equipoPrincipal[0]?.codigo ?? null,
            },
            imagenPrincipal: item.imagenPrincipal,
            imagenArrayUrl: item.imagenArrayUrl,
            codigo: item.codigo,
          };

          listaMapeada.push(equipo);
        
      }
    }
    async function mapeoManual() {


      for (let i = 0; i < general.length; i++) {
        var item =  general[i];

        const [tipoEquipo, categoria, equipoPrincipal] = await Promise.all([
          await store.get(TABLA_TIPO_EQUIPO, item.tipoEquipo),
          store.get(TABLA_CARTEGORIA_EQUIPO, item.categoria),
          (await store.get(TABLA, item.equipoPrincipal)) || null,
        ]);

        

        const equipo = {
          id: item.id,
          categoria: {
            descripcion: categoria[0]?.descripcion ?? null,
            codigo: categoria[0]?.codigo ?? null,
          },
          nombre: item.nombre,
          marca: item.marca,
          noSerie: item.noSerie,
          descripcion: item.descripcion,
          fechaAdquisionEmpresa: item.fechaAdquisionEmpresa,
          tipoEquipo: {
            descripcion: tipoEquipo[0]?.descripcion ?? null,
            codigo: tipoEquipo[0]?.codigo ?? null,
          },
          equipoPrincipal: {
            id: equipoPrincipal[0]?.id ?? null,
            nombre: equipoPrincipal[0]?.nombre ?? null,
            codigo: equipoPrincipal[0]?.codigo ?? null,
          },
          imagenPrincipal: item.imagenPrincipal,
          imagenArrayUrl: item.imagenArrayUrl,
          codigo: item.codigo,
        };

        listaMapeada.push(equipo);
      
    }
  }

  if (nombre && nombre != "null") {
    await mapeoManualRow();
    
  }else{
    await mapeoManual();

  }

    return listaMapeada;
  }

  async function getAllPrincipalesActivos() {
    //Consultando el id del tipo equipo Principal
    const tipoEquipo = await store.queryActivo(TABLA_TIPO_EQUIPO, {
      codigo: "PRIN",
    });
    return await store.listEquiposActivosTipo(TABLA, tipoEquipo.id);
  }

  async function getAllConteoTotalActivos() {
    //Consultando el id del tipo equipo Principal
    return await store.queryConteoActivo(TABLA);
  }

  //Función para consultar un registro
  async function get(id) {
    return await store.get(TABLA, id);
  }

  return {
    insert,
    getAll,
    getAllPrincipalesActivos,
    get,
    getAllConteoTotalActivos,
  };
};
