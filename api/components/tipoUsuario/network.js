const express = require("express");
const seguridad = require("../../../seguridad/index");
const errorRtf = require("../../../utils/error");

const response = require("../../../network/response");
const Controller = require("./index");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");
const router = express.Router();

router.post("/", insert);
router.get("/", getAll);
router.get("/tipo-logado", seguridad.verificandoPermisos("verificar-token") , retornarTipoLogado);

router.get("/:id", seguridad.verificandoPermisos("verificar-token") , getOne);

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

function retornarTipoLogado(req, res, next) {
  console.log("re.usser", req.user);
  
  response.success(req, res, req.user.tUsuario, 200);

}

module.exports = router;
