const express = require('express');
const cursosController = require('../controllers/cursos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

//RUTAS
api.post('/agregarCurso', md_autenticacion.Auth, cursosController.AgregarCursos);
api.get('/obtenerTodosCursos', md_autenticacion.Auth, cursosController.ObtenerTodosLosCursos);
api.get('/obtenerCursosProfesor', md_autenticacion.Auth, cursosController.ObtenerCursosProfesor);
api.put('/editarCurso/:idCurso', md_autenticacion.Auth, cursosController.EditarCursos);
api.post('/agregarAsignacionAlumno', md_autenticacion.Auth, cursosController.AgregarAsignacion)

/* api.post('/asignarCurso', md_autenticacion.Auth, cursosController.AsignarCursos); */



module.exports = api;






