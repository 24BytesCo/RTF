const express = require("express");

const response = require("../../../network/response");
const Controller = require("./index");

const router = express.Router();

router.post("/login", login);

async function login(req, res) {
  console.log("log");
  Controller.login(req.body.usuario, req.body.contrasenia)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch((err) => {
      response.error(req, res, "Datos de logueo inválidos", 400);
    });
}
module.exports = router;
