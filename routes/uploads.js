const { Router } = require('express');
const { check }  = require('express-validator');

const { 
    validarCampos, 
    validarArchivo 
} = require('../middleware/validar-campos');

const { 
    cargarArchivo, 
    // actualizarImagen, 
    actualizarImagenCloudinary,
    mostrarImagen 
} = require('../controllers/uploads')

const { coleccionesPermitidas } = require('../helpers')

const router = Router();

// ***************
// Rutas - Uploads
// ***************

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom( (coleccion) => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

router.post('/', [
    validarArchivo
], cargarArchivo)

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom( (coleccion) => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarArchivo,
    validarCampos
], actualizarImagenCloudinary)


module.exports = router;