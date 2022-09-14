const Cursos = require('../models/cursos.model');
const Asignaciones = require('../models/asignaciones.model');


// CURSOS AGREGADOS
function AgregarCursos(req, res){
    var parametros = req.body;
    var cursoModel = new Cursos();

    if ( req.user.rol == "ROL_ALUMNO" ) 
    return res.status(500).send({ mensaje: 'El alumno no puede crear cursos'});


    if(parametros.nombreCurso){
        cursoModel.nombreCurso = parametros.nombreCurso;
        cursoModel.idMaestroCurso = req.user.sub;

        cursoModel.save((err, cursoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!cursoGuardado) return res.status(500).send({ mensaje: "Error al guardar el curso"});
            
            return res.status(200).send({ curso: cursoGuardado });
        });


        Cursos.findOne({nombreCurso:"CURSO DEFAULT"}, (err, cursosEncontrados) => {

            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
    
            if(!cursosEncontrados){


                var cursoModel = new Cursos();
                cursoModel.nombreCurso = "CURSO DEFAULT";
                cursoModel.idMaestroCurso = null;

                cursoModel.save((err, cursoGuardado) => {
                    if(err) return res.status(500).send({ mensaje: "Error con la peticion guardar" });
                    if(!cursoGuardado) return res.status(500).send({ mensaje: "Error al guardar el curso"});
                });
                
            }

        })

    } else{
        return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
    }
}



// TODOS LOS CURSOS
function ObtenerTodosLosCursos(req, res) {

    Cursos.find({}, (err, cursosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!cursosEncontrados) return res.status(500).send({ mensaje: "Error al obtener los cursos"});

        return res.status(200).send({ curso: cursosEncontrados });

    }).populate('idMaestroCurso', 'nombre email')
}

// CURSOS MAESTRO
function ObtenerCursosProfesor(req, res) {

    if ( req.user.rol == "ROL_ALUMNO" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a buscar Cursos'});

    Cursos.find({idMaestroCurso:req.user.sub}, (err, cursosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!cursosEncontrados) return res.status(500).send({ mensaje: "Error al obtener los cursos"});

        return res.status(200).send({ curso: cursosEncontrados });
    }).populate('idMaestroCurso', 'nombre email')
}


// AGREGAR CURSOS SOLO ALUMNOS
// INSTRUCCIONES
// Registar el token
// 1. Debe ingresar el idCurso   2. Debe ingresar el idAlumno  3.Debe ingresar nombreCurso

function AgregarAsignacion(req, res){
    var parametros = req.body;
    var cursoModel = new Asignaciones();

    if ( req.user.rol == "ROL_MAESTRO" ) return res.status(500)
        .send({ mensaje: 'Los maestros no se pueden ingresar a los cursos'});

    if(parametros.idCurso){
        //ALUMNO
        cursoModel.idCurso = parametros.idCurso;
        cursoModel.idAlumno = req.user.sub;
        Asignaciones.find({idAlumno:req.user.sub}, (err, cantidadCursos) => {



        if ( cantidadCursos.length <3 ) {

          Asignaciones.find({ idCurso : parametros.idCurso,idAlumno:req.user.sub}, (err, asignacionEncontrada) => {
                if ( asignacionEncontrada.length ==0 ) {
                    cursoModel.save((err, asignacionGuardada) => {
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if(!asignacionGuardada) return res.status(500).send({ mensaje: "Error al guardar el asignacion"});
                        
                    return res.status(200).send({ asignacion: asignacionGuardada });
                    });
               }else{
                    return res.status(500)
                    .send({ mensaje: 'Ya se encuentra asignado' });
            }
        })
        
    } else {
        return res.status(500)
            .send({ mensaje: 'Ya no puede asignarse a mas cursos' });
    }

})


    } else{
        return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
    }
}



// EDITAR CURSOS MAESTRO
function EditarCursos(req, res) {
    var idCur = req.params.idCurso;
    var parametros = req.body;

    if ( req.user.rol == "ROL_ALUMNO" ) return res.status(500)
    .send({ mensaje: 'Solo el profesor puede editar los cursos'});

    Cursos.findByIdAndUpdate(idCur, parametros, { new: true } ,(err, cursosActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!cursosActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Cursos'});

        return res.status(200).send({ curso: cursosActualizado});
    });
}


module.exports = {
    AgregarCursos,
    ObtenerTodosLosCursos,
    ObtenerCursosProfesor,
    EditarCursos,
    AgregarAsignacion

}