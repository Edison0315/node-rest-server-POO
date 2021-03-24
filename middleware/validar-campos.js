const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next()

}

const validarTipoNumber = (req, res, next) => {

    // Destructurando las propiedades que vengan en la URI
    const { limite = 5, desde = 0 } = req.query;

    if(isNaN(Number(limite)) || isNaN(Number(desde))){
        return res.status(400).json({
            msg: "Los valores que intentas ingresar, no son numeros validos"
        });
    }

    // Convertirlos a Numeros ya que pasaron la validacion 
    req.query.limite = Number(limite);
    req.query.desde  = Number(desde);

    next()

}

const validarArchivo = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });
    }

    next()

}

module.exports = {
    validarCampos,
    validarTipoNumber,
    validarArchivo
}