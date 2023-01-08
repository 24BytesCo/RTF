const express = require("express");
const errorRtf = require("../../../utils/error");
const seguridad = require("../../../seguridad/index");

const response = require("../../../network/response");
const Controller = require("./index");

const router = express.Router();

//Creando un nuevo caso
router.post("/", seguridad.verificandoPermisos("verificar-token"), insert);

//Obtebiendo todos los casos
router.get("/", seguridad.verificandoPermisos("verificar-token"), getAll);

// Obtener un solo caso
router.get("/:id", seguridad.verificandoPermisos("verificar-token"), getOne);


async function insert(req, res, next) {
  Controller.insert(req.body)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

async function getAll(req, res, next) {
  Controller.getAll()
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

//Obtener un registro de CATEGORIA EQUIPO
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

module.exports = router;
