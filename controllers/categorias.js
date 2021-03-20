const { response, request} = require('express')

const { Categoria } = require('../models');

const obtenerCategorias = async(req, res = response) => {

    // Argumentos opcionales
    const { desde, limite } = req.query;

    const query = { estado:true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .skip(desde)
                 .limit(limite)
                 .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id)
                                     .populate('usuario', 'nombre')

    res.json({
        categoria
    });


}

const crearCategoria = async(req, res = response) => {

    const nombre      = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    // Preparar para guardar en DB
    const categoria = new Categoria(data)

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoria = async(req, res = response) => {

    const { id }  = req.params;

    const estado  = (req.body.estado)?req.body.estado:true;
    const nombre  = req.body.nombre.toUpperCase();
    
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { estado, nombre }, { new: true })

        res.json({
            categoria
        });
        
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error`,
            err: error
        })
    }

}

const eliminarCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado:false }, { new: true })

    res.json({
        categoria
    });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}
