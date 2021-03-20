const { Router } = require('express');
const { check }  = require('express-validator');

const { 
    validarCampos,
    validarTipoNumber, 
    validarJWT,
    esAdminRole
} = require('../middleware');

const { 
    existeCategoriaPorId
} = require('../helpers/db-validators');

const { 
    obtenerCategorias,
    obtenerCategoria, 
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');

const router = Router(); 

// ******************
// Rutas - Categorias
// ******************

router.get('/', [
    validarTipoNumber
], obtenerCategorias)

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom((id) => existeCategoriaPorId(id)),
    validarCampos
], obtenerCategoria)

router.post('/', [ 
    validarJWT ,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

router.put('/:id', [
    validarJWT ,
    check('id', 'No es un ID valido').isMongoId(),
    check('id', 'El id es un valor obligatorio').not().isEmpty(),
    check('id').custom((id) => existeCategoriaPorId(id)),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], actualizarCategoria)

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id', 'El id es un valor obligatorio').not().isEmpty(),
    check('id').custom((id) => existeCategoriaPorId(id)),
    validarCampos
], eliminarCategoria)


module.exports = router;