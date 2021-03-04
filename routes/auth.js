const { Router } = require('express');
const { check }  = require('express-validator');

const { validarCampos } = require('../middleware/validar-campos');

const { login, googleSignin } = require('../controllers/auth');

const router = Router(); 

router.post('/login', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
],login );

router.post('/google', [
    check('id_token', 'El id token es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignin );


module.exports = router;