const jwt = require('jsonwebtoken');

// ==============
// Verificar Token
// ==============


let verificarToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;

        next();
    });
};

// ================
// Verifica ADMIN_ROLE
// ===================
let verficarAdmin_role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        res.status(500).json({
            ok: false,
            err: {
                message: 'Este usuario no tiene permisos de administrador'
            }
        })
        return
    }


}

module.exports = {
    verificarToken,
    verficarAdmin_role
}