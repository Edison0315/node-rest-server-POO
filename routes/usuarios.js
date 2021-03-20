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
    emailExiste, 
    existeUsuarioPorId
} = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete } = require('../controllers/usuarios'); 

const router = Router(); 

// ******************
// Rutas - Categorias
// ******************

router.get('/', 
    validarTipoNumber
, usuariosGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password no es obligatorio y tener mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom((correo) => emailExiste(correo)),
    // Validacion mas por conocimiento que por funcionalidad
    // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('rol').custom( (rol) => esRolValido(rol)),
    validarCampos,
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id)),
    check('rol').custom( (rol) => esRolValido(rol)),
    validarCampos
], usuariosPut);

router.delete('/:id',
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id)),
    validarCampos
, usuariosDelete);

module.exports = router;