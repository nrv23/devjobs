const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});
const conString = process.env.DATABASEDEV;

mongoose.connect(conString,{useUnifiedTopology: true,useNewUrlParser: true});

//funcion para ver si hay error en la conexion con mongodb

mongoose.connection.on('error', error => {
	console.log(error);
})

//importar los modelos para la base de datos
// cuando el archivo de conexion se carga, se cargan los modelos y se crean automaticamente
require('../models/Vacantes');