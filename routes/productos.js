const { Router } = require('express');
const { check }  = require('express-validator');

const { 
    validarCampos, 
    validarTipoNumber,
    validarJWT,
    esAdminRole, 
    tieneRol
} = require('../middleware');

const { 
    esRolValido, 
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
} = require('../helpers/db-validators');

const {
    obtenerProductos,
    obtenerProductosPorId,
    crearProducto,
    actualizarProducto,
    eliminarInactivarProducto
} = require('../controllers/productos');

const router = Router(); 

// *****************
// Rutas - Productos
// *****************

router.get('/', [
    validarTipoNumber
], obtenerProductos)

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom((id) => existeProductoPorId(id)),
    validarCampos
], obtenerProductosPorId)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom((categoriaId) => existeCategoriaPorId(categoriaId)),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom((id) => existeProductoPorId(id)),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom((categoriaId) => existeCategoriaPorId(categoriaId)).optional(),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom((id) => existeProductoPorId(id)),
    validarCampos
], eliminarInactivarProducto)

module.exports = router;