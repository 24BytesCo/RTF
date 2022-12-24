const express = require("express");

const response = require("../../../network/response");
const Controller = require("./index");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");
const router = express.Router();

router.post("/", upSert);

async function upSert(req, res, next) {
  Controller.upSert(req.body)
    .then((result) => {
      response.success(req, res, result, 200);
    })
    .catch(next);
}
module.exports = router;
