const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async(idToken = '') =>  {
    
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, 
    });

    // Renombrar las variables destructurando un OBJ
    const { name:nombre, picture:img, email:correo } = ticket.getPayload();    

    return { nombre, img, correo };
}

module.exports = {
    googleVerify
}
