const Roles = require('../models/rol')
const Usuario = require('../models/usuario')

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
    if(!existeUsuario) throw new Error(`El id: ${correo} no existe`);
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}