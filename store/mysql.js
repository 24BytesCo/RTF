const mysql = require("mysql");

const config = require("../config");

const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.dataBase,
};

//Conectando a la Base de datos.
let conectar;

function encargadaConectar() {
  conectar = mysql.createConnection(dbConfig);

  conectar.connect((error) => {
    if (error) {
      console.error("[BD Error] => ", error);

      setTimeout(() => {
        encargadaConectar();
      }, 2000);
    } else {
      console.log("Conectado a la BD");
    }
  });

  conectar.on("error", (err) => {
    console.error("[BD Error] => ", err);

    if (err.code == "PROTOCOL_CONNETCION_LOST") {
      encargadaConectar();
    } else {
      throw err;
    }
  });
}

encargadaConectar();

//FUNCIONES A BD

function list(TABLA) {
  return new Promise((resolve, rejet) => {
    conectar.query(`SELECT *FROM ${TABLA}`, (error, data) => {
      if (error) {
        return rejet(error);
      } else {
        resolve(data);
      }
    });
  });
}

function listActivo(TABLA) {
  return new Promise((resolve, rejet) => {
    conectar.query(`SELECT *FROM ${TABLA} WHERE estado = 1`, (error, data) => {
      if (error) {
        return rejet(error);
      } else {
        resolve(data);
      }
    });
  });
}

function listActivoPaginado(TABLA, desde, hasta) {
  console.log("TABLA", TABLA);
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT  *FROM ${TABLA} WHERE estado = 1  LIMIT ${hasta} OFFSET ${desde}`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function listActivoPaginadoNombreLike(TABLA, nombre, desde, hasta) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT  *FROM ${TABLA} WHERE nombre like "%${nombre}%" and estado = 1  LIMIT ${hasta} OFFSET ${desde}`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function listActivoPaginadoMarcaLike(TABLA, nombre, desde, hasta) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT  *FROM ${TABLA} WHERE marca like "%${nombre}%" and estado = 1  LIMIT ${hasta} OFFSET ${desde}`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function listActivoPaginadoCodigoLike(TABLA, codigo, desde, hasta) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT  *FROM ${TABLA} WHERE codigo like "%${codigo}%" and estado = 1  LIMIT ${hasta} OFFSET ${desde}`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}
function listEquiposActivosTipo(TABLA, tipoEquipo) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT *FROM ${TABLA} WHERE estado = 1 and tipoEquipo="${tipoEquipo}"`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}
function get(TABLA, id) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT *FROM ${TABLA} WHERE id = "${id}"`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function insert(TABLA, data) {
  return new Promise((resolve, rejet) => {
    conectar.query(`INSERT INTO ${TABLA} SET ?`, data, (error, result) => {
      if (error) {
        return rejet(error);
      } else {
        resolve(result);
      }
    });
  });
}

function update(TABLA, data) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `UPDATE ${TABLA} SET ? WHERE ID = ?`,
      [data, data.id],
      (error, result) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function deleteInactivar(TABLA, id) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `UPDATE ${TABLA} SET estado= 0 WHERE ID = "${id}"`,
      (error, result) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function query(TABLA, query) {
  return new Promise((resolve, rejet) => {
    conectar.query(`SELECT *FROM ${TABLA} WHERE ?`, query, (error, data) => {
      if (error) {
        return rejet(error);
      } else {
        resolve(data[0] || null);
      }
    });
  });
}

function queryEquipoTipoEquipoInner(TABLA, tablaDos) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT *FROM ${TABLA} tb INNER JOIN tipoEquipo te on te.id = tb.tipoEquipo WHERE tb.estado = 1`,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data || null);
        }
      }
    );
  });
}

function queryActivo(TABLA, query) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT *FROM ${TABLA} WHERE ? and estado = 1`,
      query,
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data[0] || null);
        }
      }
    );
  });
}

function queryActivoCasoEstadoCasoDiferenteDe(codigoEstado) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT *FROM caso ca inner join estadosCaso ec on ca.estadoCaso = ec.id WHERE ec.codigo <> "${codigoEstado}" and ca.estado = 1 and ec.estado = 1`,
     
      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data[0] || null);
        }
      }
    );
  });
}

function queryConteoActivo(TABLA) {
  return new Promise((resolve, rejet) => {
    conectar.query(
      `SELECT COUNT(id) FROM ${TABLA} WHERE  estado = 1`,

      (error, data) => {
        if (error) {
          return rejet(error);
        } else {
          resolve(data[0] || null);
        }
      }
    );
  });
}

module.exports = {
  list,
  get,
  insert,
  update,
  query,
  queryEquipoTipoEquipoInner,
  queryActivo,
  listActivo,
  listEquiposActivosTipo,
  listActivoPaginado,
  queryConteoActivo,
  listActivoPaginadoNombreLike,
  listActivoPaginadoMarcaLike,
  listActivoPaginadoCodigoLike,
  deleteInactivar,
  queryActivoCasoEstadoCasoDiferenteDe
};
