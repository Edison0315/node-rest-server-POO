const { response, request} = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    // Optional args
    const { desde, limite } = req.query;

    // Query del condicional
    const query = { estado: true }

    // const usuarios = await Usuario.find({estado: true})
    //     .skip(desde)
    //     .limit(limite)

    // const total    = await Usuario.countDocuments({estado: true});

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ])

    res.json({
        total, 
        usuarios
    })
}

const usuariosPost = async(req, res = response) => {
    
    // Operador Rest para clonar el OBJ y sacar el resto de campos
    // const { google, ...rest } = req.body;

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    // Guardar en DB
    await usuario.save();
    
    res.json({
        usuario
    })
}

const usuariosPut = async(req, res = response) => {

    // Destructurando
    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    // Validar en la DB
    if(password){
        // Encriptar la password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest);

    res.json({
        usuario
    })
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos 
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        usuario
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "get API - Controlador"
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}