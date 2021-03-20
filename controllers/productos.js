const { response, request} = require('express')

const Producto = require('../models/producto');

const obtenerProductos = async(req = request, res = response) => {

    // Optional args
    const { desde, limite } = req.query;

    // Validar si los registros estan activos
    const query = {estado: true}

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .skip(desde)
                .limit(limite)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
    ])

    res.json({
        total, 
        productos
    })

}

const obtenerProductosPorId = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')

    res.json({
        producto
    })

}

const crearProducto = async(req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body, 
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    // Preparar los recursos a guardar
    const producto = new Producto(data)

    try {
        // Guardar en la DB
        await producto.save();

        res.status(201).json({
            producto
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un error realizando el proceso, consulte con el administrador'
        })
    }

}

const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre  = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    try {
        const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
        
        res.json({
            producto
        })
        
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error`,
            err: error
        })
    }

}

const eliminarInactivarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const query = { estado:false };

    try {
        
        const producto = await Producto.findByIdAndUpdate(id, query, {new:true})

        res.json({
            producto
        })

    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error`,
            err: error
        })
    }

}

module.exports = {
    obtenerProductos,
    obtenerProductosPorId,
    crearProducto,
    actualizarProducto,
    eliminarInactivarProducto
}