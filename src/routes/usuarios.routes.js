const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// REGISTRARSE
api.post('/agregarMaestroDefecto', usuariosController.RegistrarMaestroDefecto);
api.post('/agregarAlumnos', usuariosController.RegistrarAlumno);
//OBTENER TOKENS
api.post('/login', usuariosController.Login);

//CAMPOS CON MIDDLEWARES Y TOKENS
api.put('/editarUsuarios', md_autentificacion.Auth, usuariosController.EditarUsuarios);
api.delete('/eliminarUsuarios', md_autentificacion.Auth, usuariosController.EliminarUsuarios)


module.exports = api
