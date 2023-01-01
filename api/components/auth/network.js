const express = require("express");

const response = require("../../../network/response");
const Controller = require("./index");
const seguridad = require("../../../seguridad/index");
const router = express.Router();

router.post("/login", login);
router.get("/verificar", seguridad.verificandoPermisos(''), verificar);
router.get("/hora-servidor", seguridad.verificandoPermisos('ver-hora-server'), horaServidor);

async function login(req, res) {
  Controller.login(req.body.usuario, req.body.contrasenia)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch((err) => {
      response.error(req, res, "Datos de logueo inválidos", 400);
    });
}

async function verificar(req, res) {
  Controller.verificar(req)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch((err) => {
      response.error(req, res, "El token es inválido", 400);
    });
}

function horaServidor(req, res) {
  response.success(req, res, new Date(), 200);
}  

module.exports = router;
