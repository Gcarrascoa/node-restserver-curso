const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', function(req, res) {
    let body = req.body;
    console.log(body);
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            res.starus(500).json({
                ok: false,
                err
            });
            return
        }
        console.log(usuarioDB);

        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario no existe"
                }
            })
            return
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.jstatus(400).json({
                ok: false,
                err: {
                    message: "La contrase es incorrecta"
                }
            })
            return
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.FECHA_EXP })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});


module.exports = app;