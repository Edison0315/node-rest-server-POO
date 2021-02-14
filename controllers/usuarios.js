const { response } = require('express');

const usuariosGet = (req, res = response) => {

    // Si necesito todos las propiedades que vengan ahi
    // const query = req.query;

    // Destructurando
    const { id, query = 'no query', page = 1, limit = 5 } = req.query;


    res.json({
        msg: "get API - Controlador",
        id, 
        query, 
        page, 
        limit
    })
}

const usuariosPost = (req, res = response) => {
    
    // Destructurando el OBJ del body del request
    // const {nombre, edad} = req.body;

    const body = req.body;
    
    res.json({
        msg: "post API - Controlador",
        body
    })
}

const usuariosPut = (req, res = response) => {

    // Modo clasico
    // const id = req.params.id;

    // Destructurando
    const { id } = req.params;

    res.json({
        msg: "put API - Controlador",
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "get API - Controlador"
    })
}

const usuariosDelete = (req, res = response) => {
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