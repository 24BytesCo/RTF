//Para generar ids
const { nanoid } = require("nanoid");
const TABLE = "usuario";
const auth = require("../auth/");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");
const errorRtf = require("../../../utils/error");

module.exports = function (inyectedStore) {
  // let store = inyectedStore || require("../../../store/mysql");
  let store = require("../../../store/mysql");

  //Función para consultar todos los registros de una tabla
  function list() {
    return store.list(TABLE);
  }

  //Función para consultar un registro
  function get(id) {
    return store.get(TABLE, id);
  }

  //Funcíon para crear y editar
  async function insert(body) {
    const user = {
      primerNombre: body.primerNombre || null,
      segundoNombre: body.segundoNombre || null,
      primerApellido: body.primerApellido || null,
      segundoApellido: body.segundoApellido || null,
      correoElectronico: body.correoElectronico || null,
      numeroTelefono: body.numeroTelefono || null,
      usuario: body.usuario || null,
      tipoUsuario: body.tipoUsuario || null,
      estado: 1,
    };

    //Validaciones
    if (body.id) {
      user.id = body.id;
    } else {
      user.id = nanoid();
    }

    //validaciones
    validacionesParametrosRtf(user, [
      "usuario",
      "contrasenia",
      "primerNombre",
      "primerApellido",
      "correoElectronico",
      "tipoUsuario",
    ]);

    //Validando la no existencia de éstas propiedades en la BD
    await validandoExistencia("usuario", { usuario: user.usuario });
    await validandoExistencia("usuario", {
      correoElectronico: user.correoElectronico,
    });

    //Validando tipo usuario
    const tipoUsuarioBd = await store.get("tipoUsuario", user.tipoUsuario);

    if (!tipoUsuarioBd || tipoUsuarioBd.length == 0) {
      throw new errorRtf("El Tipo de Usuario enviado es inválido", 400);
    }

    //Creando registro en Autenticación
    if (body.contrasenia && body.usuario) {
      //Creando Autenticación
      await auth.insert({
        id: user.id,
        usuario: body.usuario,
        contrasenia: body.contrasenia,
        estado: 1,
      });
    }

    //Creando Usuario
    return await store.insert(TABLE, user);
  }

  //Inactivando un usuario usuario
  async function elimnar(params) {}

  return {
    list,
    get,
    insert,
  };
};
