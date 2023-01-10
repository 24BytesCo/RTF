
function concatenarNombreCompleto(usuario) {
    return (usuario.primerNombre +" "+ usuario.segundoNombre +" "+ usuario.primerApellido +" "+ usuario.segundoApellido).replace("null", "").replace("  ", " ").replace("  "," ");
}



module.exports = {
    concatenarNombreCompleto
}