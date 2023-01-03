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

    let listaMapeada = [];
    let general = await store.listActivo(TABLA);


    async function hola(){
      for (let i=0; i<general.length; i++) 
      {
        const item = general[i];
        const tipoEquipo = await store.get(TABLA_TIPO_EQUIPO, item.tipoEquipo);
        const categoria = await store.get(TABLA_CARTEGORIA_EQUIPO, item.categoria);
        const equipoPrincipal = await store.get(TABLA, item.equipoPrincipal) || null;
        const equipo = 
        {
          id: item.id,
          categoria:  
          {
            descripcion: categoria[0].descripcion,
            codigo: categoria[0].codigo,
          },  
          nombre: item.nombre,
          marca: item.marca,
          noSerie: item.noSerie,
          descripcion: item.descripcion,
          fechaAdquisionEmpresa: item.fechaAdquisionEmpresa,
          tipoEquipo:  
          {
            descripcion: tipoEquipo[0].descripcion,
            codigo: tipoEquipo[0].codigo,
          },
          equipoPrincipal: 
          {
            id: equipoPrincipal[0]?.id?? null,
            nombre: equipoPrincipal[0]?.nombre?? null ,
            codigo: equipoPrincipal[0]?.codigo?? null,
          },
          imagenPrincipal: item.imagenPrincipal,
          imagenArrayUrl: item.imagenArrayUrl,

        }

        console.log("equipo", equipo);

        listaMapeada.push(equipo);
        
      }
    }

    await hola();

    return listaMapeada;


  }

  async function getAllPrincipalesActivos() {
    //Consultando el id del tipo equipo Principal
    const tipoEquipo = await store.queryActivo(TABLA_TIPO_EQUIPO, { codigo: 'PRIN'});
    return await store.listEquiposActivosTipo(TABLA, tipoEquipo.id);
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
  };
};
