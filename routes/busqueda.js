var express = require('express');

var app = express();

var Hospital = require('../models/hospital')
var Medicos = require('../models/medico')
var Usuarios = require('../models/usuario')

// ===================================
// Busqueda por coleccion
// ===================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
        var tabla = req.params.tabla;
        var busqueda = req.params.busqueda;
        var regex = new RegExp(busqueda, 'i')

        var promesa;

        switch (tabla) {
            case 'medico':
                promesa = buscarMedicos(regex);
                break;
            case 'usuario':
                promesa = buscarUsuarios(regex);
                break;
            case 'hospital':
                promesa = buscarHospitales(regex);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                    error: { message: 'Tipo de tabla no válido' }
                });

        }
        promesa.then(data => {
            res.status(200).json({
                ok: true,
                [tabla]: data,
            });
        })
    })
    // ===================================
    // Busqueda general
    // ===================================

app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([
            buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuarios(regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});


function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    })

}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {
        Medicos.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    })
}

function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {
        Usuarios.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios);
                }
            })
    })

}

module.exports = app;