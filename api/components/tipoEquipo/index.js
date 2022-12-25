//Se define base de datos en caso de que se quiera usar otra mpara pruebas
const store = require("../../../store/mysql");
const controller = require("./controller");

//Controlador como si fuese una función a la que se le inyecta el store
//Perfectamente aislado
module.exports = controller(store);
