const express = require("express");

const response = require("../../../network/response");
const Controller = require("./index");
const {
  validacionesParametrosRtf,
  validandoExistencia,
} = require("../../../utils/validaciones");
const router = express.Router();

router.post("/", insert);
router.get("/", getAll);

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
module.exports = router;
