const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// REGISTRAR AL MAESTRO POR DEFECTOdddddd

function RegistrarMaestroDefecto(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();


            usuarioModel.nombre = "MAESTRO";
            usuarioModel.apellido = "Perez";
            usuarioModel.password = "123456";
            usuarioModel.email = "JorgePerez56@kinal.edu.gt";
            usuarioModel.rol = 'ROL_MAESTRO';
            usuarioModel.imagen = null;

            Usuarios.find({ email: "JorgePerez56@kinal.edu.gt"}, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    
}


// REGISTRAR A LOS ALUMNOS
function RegistrarAlumno(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if(parametros.nombre && parametros.apellido && 
        parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.apellido = parametros.apellido;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'ROL_ALUMNO';
            usuarioModel.imagen = null;

            Usuarios.find({ email : parametros.email }, (err, alumnoEncontrado) => {
                if ( alumnoEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el alumno'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    } else{
        return res.status(500)
        .send({ mensaje: 'Debe llenar los campos necesarios'});
    }
}

// LOGIN
function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                    
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contraseña no es correcta, intentalo de nuevo'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra, intentelo de nuevo'})
        }
    })
}

// SOLO SE PUEDE EDITAR NOMBRE Y APELLIDO
function EditarUsuarios(req, res){
    var parametros = req.body; 
   
    if(parametros.nombre&&parametros.apellido){
        Usuarios.findByIdAndUpdate(req.user.sub, 
            {nombre: parametros.nombre, apellido: parametros.apellido }, {new: true}, 
            (err, usuarioActualizado)=>{
                if(err) return res.status(500)
                    .send({ mensaje: 'Error en esta peticion' });
                if(!usuarioActualizado) return res.status(500)
                    .send({ mensaje: 'Error al editar los datos del usuario'});
                
                return res.status(200).send({usuario : usuarioActualizado})            
        })
        


    } else {
        return res.status(500).send({ mensaje: 'Solo puede modificar nombre y apellido'});
    }

}

// ELIMINAR
function EliminarUsuarios(req, res){

    Usuarios.findByIdAndDelete(req.user.sub, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuarioEliminado) return res.status(404).send({mensaje: "Error al eliminar usuario"})

        return  res.status(200).send({ usuario: usuarioEliminado });
    })
}

module.exports ={
    RegistrarMaestroDefecto,
    RegistrarAlumno,
    Login,
    EditarUsuarios,
    EliminarUsuarios
}


