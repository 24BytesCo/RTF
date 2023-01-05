const errorRtf = require("../utils/error");

//Abstaccion de una base de datos para probar modelo
const baseDatos = {
  user: [],
  tipoUsuario: [],
};

async function list(tabla) {
  return baseDatos[tabla];
}

async function get(tabla, id) {
  let datosBaseDatos = await list(tabla);
  return datosBaseDatos.filter((item) => item.id == id)[0] || null;
}

async function insert(tabla, data) {
  if (!baseDatos[tabla]) {
    baseDatos[tabla] = [];
  }

  baseDatos[tabla].push(data);

  return await get(tabla, data.id);
}

async function remove(tabla, id) {
  return true;
}

async function query(tabla, consulta, estado = false) {
  let datosBaseDatos = await list(tabla);

  let llaves = Object.keys(consulta);
  let llave = llaves[0];

  if (!estado || estado == false) {
    return (
      datosBaseDatos.filter((item) => item[llave] === consulta[llave])[0] ||
      null
    );
  }

  return (
    datosBaseDatos.filter(
      (item) => item[llave] === consulta[llave] && item.estado == 1
    )[0] || null
  );
}

module.exports = {
  list,
  get,
  insert,
  remove,
  query,
};
