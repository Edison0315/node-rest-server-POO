const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response }     = require("express")
const { subirArchivo } = require('../helpers')

const { Usuario, Producto } = require('../models')

const cargarArchivo = async(req, res = response) => {

    try {
        // Imagenes
        // const nombre = await subirArchivo(req.files, ['txt'], 'textos')
        const nombre = await subirArchivo(req.files)
        
        return res.json({
            nombre
        })

    } catch (error) {
        
        return res.status(400).json({
            msg: error
        })

    }

}

// const actualizarImagen = async(req, res = response) => {

//     const { id, coleccion } = req.params;

//     let modelo;

//     switch (coleccion) {
//         case 'usuarios':
//             modelo = await Usuario.findById(id)

//             if(!modelo){
//                 return res.status(400).json({
//                     msg: `No existe un usuario con el id: ${id}`
//                 })
//             }
//         break;

//         case 'productos':
//             modelo = await Producto.findById(id)

//             if(!modelo){
//                 return res.status(400).json({
//                     msg: `No existe un producto con el id: ${id}`
//                 })
//             }
//         break;
    
//         default:
//             return res.status(500).json({
//                 msg: 'Ocurrio un error, valide de nuevo'
//             })
//     }

//     // Limpiar imagenes previas
//     if( modelo.img ){
//         // Borrar la img del servidor
//         const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img);
//         if(fs.existsSync(pathImage)){
//             fs.unlinkSync(pathImage)
//         }
//     }

//     const nombre = await subirArchivo(req.files, undefined, coleccion)
//     modelo.img = nombre;

//     await modelo.save();

//     res.json({
//         modelo
//     })

// }

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Ocurrio un error, valide de nuevo'
            })
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        // Borrar la img del servidor
        const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImage)){
            return res.sendFile(pathImage)
        }
    }

    // Imagen por defecto
    const pathImage = path.join( __dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImage)
}

const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Ocurrio un error, valide de nuevo'
            })
    }

    // **************************************
    // Limpiar imagenes previas de cloudinary
    // **************************************
    if( modelo.img ){
        // Separar la cadena con / para obtener el nombre
        const nombreArr     = modelo.img.split('/')

        // Obtener la ultima posicion para tener el nombre del archivo
        const nombre        = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.')

        // Borrar la imagen en cloudinary
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    })

}

module.exports = {
    cargarArchivo,
    // actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}