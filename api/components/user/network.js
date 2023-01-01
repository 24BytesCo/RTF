const express = require("express");
const errorRtf = require("../../../utils/error");
const response = require("../../../network/response");
const Controller = require("./index");
const seguridad = require("./secure");

const router = express.Router();

//Rutas
router.get("/",  getAll);
router.get("/:id", getOne);
router.post("/",  insert);
router.put("/",  seguridad("update-usuario"), insert);

//Funciones

function validar() {
  console.log("validando");
}

//Obtener todos los registros de usuarios
function getAll(req, res, next) {
  Controller.list()
    .then((todosUsuarios) => {
      response.success(req, res, todosUsuarios, 200);
    })
    .catch(next);
}

//Obtener un registro de usuario
function getOne(req, res, next) {
  if (!req.params.id) {
    throw new errorRtf("Debes enviar un ID", 400);
  }
  Controller.get(req.params.id)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch(next);
}

//Crear un nuevo usuario
function insert(req, res, next) {
  Controller.insert(req.body)
    .then((user) => {
      response.success(req, res, user, 201);
    })
    .catch(next);
}

module.exports = router;
