//Para generar ids
const { nanoid } = require("nanoid");
const TABLE = "user";
const auth = require("../auth/");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");

module.exports = function (inyectedStore) {
  let store = inyectedStore || require("../../../store/bd-fake");

  //Función para consultar todos los registros de una tabla
  function list() {
    return store.list(TABLE);
  }

  //Función para consultar un registro
  function get(id) {
    return store.get(TABLE, id);
  }

  //Funcíon para crear y editar
  async function upSert(body) {
    const user = {
      primerNombre: body.primerNombre || null,
      segundoNombre: body.segundoNombre || null,
      primerApellido: body.primerApellido || null,
      segundoApellido: body.segundoApellido || null,
      correoElectronico: body.correoElectronico || null,
      numeroTelefono: body.numeroTelefono || null,
      usuario: body.usuario || null,
    };

    //Validaciones
    if (body.id) {
      user.id = body.id;
    } else {
      user.id = nanoid();
    }

    //validaciones
    validacionesParametrosRtf(body, [
      "usuario",
      "contrasenia",
      "primerNombre",
      "primerApellido",
      "correoElectronico",
    ]);

    //Validando la no existencia de éstas propiedades en la BD
    await validandoExistencia("user", { usuario: user.usuario });
    await validandoExistencia("user", {
      correoElectronico: user.correoElectronico,
    });

    //Creando registro en Autenticación
    if (body.contrasenia && body.usuario) {
      //Creando Autenticación
      await auth.upSert({
        id: user.id,
        usuario: body.usuario,
        contrasenia: body.contrasenia,
      });
    }

    //Creando Usuario
    return await store.upSert(TABLE, user);
  }

  //Inactivando un usuario usuario
  async function elimnar(params) {}

  return {
    list,
    get,
    upSert,
  };
};
