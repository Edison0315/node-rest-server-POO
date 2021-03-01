const { response, request} = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

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

module.exports = { 
    login 
}