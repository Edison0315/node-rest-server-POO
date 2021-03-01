const express      = require('express')
const cors         = require('cors')
const dbConnection = require('../database/config')

class Server {

    constructor(){
        this.app  = express();
        this.port = process.env.PORT;

        // Rutas
        this.authPath     = '/api/auth';
        this.usuariosPath = '/api/usuarios';

        // Conexion a la DB
        this.conectarDB();

        // Middlewares
        this.middlewares()

        // Rutas de mi Aplicacion
        this.routes()
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        // Cors
        this.app.use( cors() )

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio publico
        this.app.use( express.static('public') )
    }

    routes(){

        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en: ${this.port}`)
        })
    }
}

module.exports = Server;