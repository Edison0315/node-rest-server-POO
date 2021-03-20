const { 
    Roles, Usuario, 
    Categoria, Producto 
} = require('../models');

const esRolValido = async(rol = '') => {
    const existeRol = await Roles.findOne({rol}).exec();
    if(!existeRol) throw new Error(`El rol ${rol} no esta registrado en la DB`);
}

const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({ correo }).exec();  
    if(existeEmail) throw new Error(`El correo: ${correo} ya esta registrado en la DB`);
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) throw new Error(`El usuario con id: ${id} no existe`);
}

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria) throw new Error(`La categoria con id: ${id} no existe`)
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto) throw new Error(`El producto con id: ${id} no existe`)
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}