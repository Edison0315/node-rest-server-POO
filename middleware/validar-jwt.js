const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async(req = require, res = response, next) => {
    
    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        // Leer el usuario que corresponde a ese uid
        const usuario = await Usuario.findById(uid)

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - El usuario no existe en la DB'
            })
        }

        // Verificar si el uid no esta inactivo
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario inactivo'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        
        console.log(error);
        return res.status(401).json({
            msg: "Token no valido"
        });

    }

}

module.exports = {
    validarJWT
} 