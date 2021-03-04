const { response, request} = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')

const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async(req = request, res = response) => {

    const { correo, password } = req.body

    try {
     
        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - correo'
            })  
        }

        // Verificar usuario activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - estado false'
            })  
        }

        // Verificar password
        const validPassword = bcryptjs.compareSync(password, usuario.password) 
        
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - password'
            })  
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            msg: 'Hable con el administrador'
        })  
    }

}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        // Sino existe, se crea
        if(!usuario){
            const data = {
                nombre, 
                correo,
                password: 'no-password-google-acc',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en la DB
        if(!usuario.estado){
            res.status(401).json({
                msg: 'Ups, hubo un problema. Hable con el administrador',
            })    
    
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })    
        
    } catch (error) {
        
        res.status(400).json({
            msg: 'Token de Google no es valido',
            error
        })

    }

}

module.exports = { 
    login,
    googleSignin
}