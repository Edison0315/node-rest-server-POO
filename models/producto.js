const { Schema, model } = require('mongoose')

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    precio: {
        type: Number,
        default: 0
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario creador es obligatorio']
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoria es obligatoria']
    }
})

ProductoSchema.methods.toJSON = function(){
    const { __v, ...data } = this.toObject()
    return data;
}

module.exports = model('Producto', ProductoSchema) 