const express = require('express');
const asignacionController = require('../controllers/asignaciones.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// RUTAS
api.get('/obtenerTodasAsignaciones', md_autenticacion.Auth, asignacionController.ObtenerAsignaciones)
api.get('/obtenerAsignacionesAlumno/:idAlumno?',md_autenticacion.Auth, asignacionController.ObtenerAsignacionesAlumno)

module.exports = api;

