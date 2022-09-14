const mongoose = require('mongoose');
const app = require('./app');


// BASE DE DATOS 
mongoose.Promise = global.Promise;                                                                
mongoose.connect('mongodb://localhost:27017/LABORATORIO2_IN6BM', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log('El servidor corre sin problemas')
    })

}).catch(error => console.log(error));
