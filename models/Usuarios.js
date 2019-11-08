const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
	email:{
		type: String,
		unique: true, // todos los correos deben ser unicos
		lowercase: true, // todo se convierte a minuscula
		trim: true, // quitar espacios en blanco
		required: true
	}, 
	nombre:{
		type: String,
		lowercase: true,
		required: true
	},
	password:{
		type: String,
		required: true,
		trim: true

	},
	token: String, // para actualizar el password,
	expira: Date// tiempo de expiracion del token

});

//hashear pass antes de guardar los usuarios

usuariosSchema.pre('save', async function(next){
	if(!this.isModified('password')) return next(); //// si el password ya esta hasheado continuar con el siguiente middleware
	// this hace referencia a las propiedades del objeto usuariosSchema
 	
	const hash = await bcrypt.hash(this.password, 12);

	//asignar el password encriptado

	this.password= hash;

	next();


}) // pre es un hooks que se ejecuta antes de hacer el insert a la bd
// funcion para mostrar el error cuando se inserta un email a existente

usuariosSchema.post('save', function(error,doc, next){
	//verificar por el nombre y el codigo del error
	if(error.name === 'MongoError' && error.code === 11000){
		next('El email ya esta registrado'); // enviar el mensaje del error al siguiente middleware
	}else{
		next(error); // si el error es de otro tipo enviarlo 
	}
})

//crear una function personalizada en mongoose
usuariosSchema.methods = {

	validarContrasena : function(password) {
		return bcrypt.compareSync(password, this.password);
	}
}

//mongo utiliza hooks que son basicamente funciones que se ejecutan antes, despues o en diferentes acciones
//por ejemplo pre es antes de insertar en la bd, post es despues de insertar en la bd y asihay varios
module.exports= mongoose.model('Usuarios', usuariosSchema);