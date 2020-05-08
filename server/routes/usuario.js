const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore'); //para filtrar datos que quiera mostrar

const Usuario = require('../models/usuario');
const { verificarToken, verficarAdmin_role } = require('../middlewares/autenticacion')

const app = express();



// =======================
// ==    GET USUARIO    ==
// =======================

app.get('', function(req, res) {
    res.json({
        datos: "Server activo"
    })
})

app.get('/usuario', verificarToken, function(req, res) {
    //  /usuario?desde=10   , forma de mandar parametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);
    //  /usuario?desde=10&limite=10
    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        //como primer parametro, podemos darle una condicion a cumplir    
        //como segundo parametro, podemos dar los que queremos que nos devuelva
        .skip(desde) //salta los primeros 5    
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                ok: false,
                err
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })

});

// =======================
// ==   POST USUARIO    ==
// =======================
//crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body; // require('body-parser')

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //no queremos mostrar la contraseña en res.json
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// =======================
// ==    PUT USUARIO    ==
// =======================
//actualizar registros
// http://localhost:3000/usuario/12345
app.put('/usuario/:id', [verificarToken, verficarAdmin_role], function(req, res) {
    let id = req.params.id; //con el id , buscaremos en la BD
    let opcionesValidar = ['nombre', 'email', 'img', 'role', 'estado']
    let body = _.pick(req.body, opcionesValidar); //con el body actualizaremos los datos

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        //con new podemos mostrar la ultima actualizacion en el json
        //con runValidators, las cosas del models se mantienen (validaciones)
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

// =======================
// ==  DELETE USUARIO  ==
// =======================

//borrar (actualmente solamente cambiar estados)
app.delete('/usuario/:id', [verificarToken, verficarAdmin_role], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estodo: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
            return
        }
        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;