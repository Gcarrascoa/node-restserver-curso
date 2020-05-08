require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

//codigo que se ejecuta al momento de iniciar el archivo
//parse application/x-www-form-urlenconded
app.use(bodyParser.urlencoded({ extended: false }))

//parsea aplication/json
app.use(bodyParser.json())

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

// configuracion global de rutas
app.use(require('./routes/index'))


mongoose
    .connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('base de datos ONLINE'))
    .catch(err => console.log('No se pudo conectar', err));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);

});