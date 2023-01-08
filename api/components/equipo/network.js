const express = require("express");
const errorRtf = require("../../../utils/error");
const seguridad = require("../../../seguridad/index");

const response = require("../../../network/response");
const Controller = require("./index");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");
const router = express.Router();

//Creando un nuevo equipo
router.post("/", seguridad.verificandoPermisos("verificar-token"), insert);

//Editando un nuevo equipo
router.put("/", seguridad.verificandoPermisos("verificar-token"), update);

//Obtebiendo todos los equipos
router.get("/", seguridad.verificandoPermisos("verificar-token"), getAll);

// Obtener lista de equipos principasles
router.get(
  "/principales",
  seguridad.verificandoPermisos("verificar-token"),
  getAllPrincipalesActivos
);

// Obtener lista de equipos activos
router.get(
  "/total-activos",
  seguridad.verificandoPermisos("verificar-token"),
  totalActivos
);

// Obtener un solo equipo
router.get("/:id", getOne);

async function insert(req, res, next) {
  Controller.insert(req.body)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

async function update(req, res, next) {
  Controller.update(req.body)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

async function getAll(req, res, next) {
  await Controller.getAll(req)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

async function getAllPrincipalesActivos(req, res, next) {
  Controller.getAllPrincipalesActivos()
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

async function totalActivos(req, res, next) {
  Controller.getAllConteoTotalActivos()
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}

//Obtener un registro de CATEGORIA EQUIPO
async function getOne(req, res, next) {
  if (!req.params.id) {
    throw new errorRtf("Debes enviar un ID", 400);
  }
  await Controller.get(req.params.id)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch(next);
}

module.exports = router;
