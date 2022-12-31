const express = require("express");
const bodyParser = require("body-parser");
const config = require("../config");
const swaggerUi = require("swagger-ui-express");

const user = require("./components/user/network");
const auth = require("./components/auth/network");
const tipoUsuario = require("./components/tipoUsuario/network");
const categoriaEquipo = require("./components/categoriaEquipo/network");
const tipoEquipo = require("./components/tipoEquipo/network");
const equipo = require("./components/equipo/network");

const errores = require("../network/gestionErrores");

const app = express();
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(express.json());
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: "text/html" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Router
app.use("/api/usuario", user);
app.use("/api/equipo", equipo);
app.use("/api/autenticacion", auth);
app.use("/api/tipo-usuario", tipoUsuario);
app.use("/api/categoria-equipo", categoriaEquipo);
app.use("/api/tipo-equipo", tipoEquipo);

const swaggerDoc = require("./swagger.json");

app.use("/api-sw", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errores);
app.listen(config.api.port, () => {
  console.log("Api escuchando en el puerto ", config.api.port);
});
