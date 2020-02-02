// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();


// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar rutas
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imageRoutes = require('./routes/imagen');

mongoose
    .connect('mongodb://localhost:27017/hospitalDB', {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online'))
    .catch(err => {
        console.log('DB Connection Error:' + err.message);
    });

// Rutas
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/image', imageRoutes);

app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
})