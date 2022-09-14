const Asignaciones = require('../models/asignaciones.model');


//ASIGNACIONES DE TODOSsss
function ObtenerAsignaciones(req, res) {
    Asignaciones.find((err, asignacionEncontrada) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!asignacionEncontrada) return res.status(500).send({ mensaje: "Error al obtener las asignaciones."});

        return res.status(200).send({ asignacion: asignacionEncontrada });

    }).populate('idCurso', 'nombreCurso')
        .populate('idAlumno', 'nombre apellido email');
}

// ASIGNACIONES DE ALUMNOssssss
function ObtenerAsignacionesAlumno(req, res) {
    var idOpcional = req.params.idAlumno
   

    if(idOpcional != null && idOpcional){
        

        Asignaciones.find({idAlumno:idOpcional},(err, asignacionEncontrada1) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!asignacionEncontrada1) return res.status(500).send({ mensaje: "Error al obtener las asignaciones."});
    
            return res.status(200).send({ asignacion1: asignacionEncontrada1 });
    
        }).populate('idCurso', 'nombreCurso').populate('idAlumno','nombre email')


    }else{

        if ( req.user.rol == "ROL_MAESTRO" ) return res.status(500)
        .send({ mensaje: 'Los maestros deben colocar el ID del alumno en la ruta (ruta opcional)'});


        Asignaciones.find({idAlumno:req.user.sub},(err, asignacionEncontrada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!asignacionEncontrada) return res.status(500).send({ mensaje: "Error al obtener las asignaciones."});
    
            return res.status(200).send({ asignacion: asignacionEncontrada });
    
        }).populate('idCurso', 'nombreCurso').populate('idAlumno','nombre email')

    }


}

module.exports = {
    ObtenerAsignaciones,
    ObtenerAsignacionesAlumno

}


