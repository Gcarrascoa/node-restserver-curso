require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//codigo que se ejecuta al momento de iniciar el archivo
//parse application/x-www-form-urlenconded
app.use(bodyParser.urlencoded({ extended: false }))

//parsea aplication/json
app.use(bodyParser.json())



app.get('/usuario', function(req, res) {
    res.json('Hola mundo');
});


//crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body; // require('body-parser')

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        })
    }

    res.json({
        body
    });
});

//actualizar registros
// http://localhost:3000/usuario/12345
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

//borrar (actualmente solamente cambiar estados)
app.delete('/usuario', function(req, res) {
    res.json('Hola mundo');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);

});