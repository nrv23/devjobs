//modelo vacantes para la base de datos

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug'); // generar urls amigables
const helper = require('../helpers/helper');

const vacantesSchema = new mongoose.Schema({
	titulo: {
		type: String, // tipo de campo,
		required: 'El nombre de la vacante es requerido', //mensaje de error si el campo esta vacio
		// 
		trim: true //habilitar la funcion trim para quitar espacios en blanco
	},
	empresa:{
		type: String, // tipo de campo,
		trim: true //habilitar la funcion trim para quitar espacios en blanco
	},
	ubicacion:{
		type: String, // tipo de campo,
		trim: true, //habilitar la funcion trim para quitar espacios en blanco
		required: 'La ubicacion es requerida' //mensaje de error si el campo esta vacio	
	},
	salario:{
		type: String,
		default: 0, // valor por defecto
		trim: true
	},
	contrato:{
		type: String,
		trim: true
	},
	descripcion:{
		type: String,
		trim: true	
	},
	url: {
		type: String,
		lowercase: true
	},
	skills: [String], // declarar un campo de tipo array String, las habilidade
	candidatos: [{ // tipo de dato lista de objetos porque va contener una lista de candidatos a un puesto
		nombre: String,
		email: String,
		cv: String // se va guardar la ubicacion del pdf
	}]
})
// utilizar hooks en mongoose

vacantesSchema.pre('save', function(next)  {
 //toma el parametro next para que despues de ejecutar lo que hace la funcion, next ejecute 
 // el resto del codigo
 //generar un id para cada url;
 //this se usa el puntero this porque se esta llamando a una propiedad del mismo modelo
 //algo como usar clases
 let url = slug(this.titulo); // se crea la url
 // se crea un id unico para la url
 
 url+=`-${helper.getID()}`;
 this.url= url;
 next();
})//middleware que va ejecutar antes de guarda el registro en la bd
module.exports = mongoose.model('Vacante', vacantesSchema);

//asignar al schema de mongoose el modelo, se va llamar vacante y el objeto vacantesSchema trae la estructura
// de ese modelo


