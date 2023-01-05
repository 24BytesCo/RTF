const errorRtf = require("./error");
let store = require("../store/mysql");

function validacionesParametrosRtf(body, arrayPropiedades) {
  for (let clave in body) {
    var busqueda = arrayPropiedades.filter((r) => clave == r);

    if (busqueda.length > 0) {
      if (!body[clave]) {
        throw new errorRtf("El parámetro " + clave + " es requerido", 400);
      }
    }
  }
}

async function validandoExistencia(tabla, propiedad) {
  var dataAth = await store.query(tabla, propiedad);


  var pro = "";
  for (let clave in propiedad) {
    pro = clave;
  }
  if (dataAth) {
    throw new errorRtf(
      "No se pudo crear porque la propiedad " +
        pro +
        " ya existe en la Base de Datos",
      400
    );
  }
}

async function validandoExistenciaConEstado(tabla, propiedad) {
  var dataAth = await store.queryActivo(tabla, propiedad);
  var pro = "";
  for (let clave in propiedad) {
    pro = clave;
  }
  if (dataAth) {
    throw new errorRtf(
      "No se pudo crear porque la propiedad " +
        pro +
        " ya existe en la Base de Datos",
      400
    );
  }
}

module.exports = {
  validacionesParametrosRtf,
  validandoExistencia,
  validandoExistenciaConEstado,
};
