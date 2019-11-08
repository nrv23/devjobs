const passport = require('passport');
const localStrategy = require('passport-local').Strategy; // escoger con cual de las formas se va loguear
//, hay mas de 300
const Usuarios = require('../models/Usuarios');


//configuracion de passport para autenticacion


passport.use(new localStrategy({
	//configurar los campos que se van ausar para el login del usuario
	//estos son los campos de la base de datos para que passport haga la consulta
	usernameField: 'email',
	passwordField: 'password'
}, async (email, password, done) => { // esta funcion es la que lee los valores del formulario de inciar sesion
	// los parametros email y password son los campos de el form de login

	const usuario = await Usuarios.findOne({email});
	
	if(!usuario){ // sino existe el usuario
		
		return done(null,false, {
			message: 'El correo no existe' // mensaje de error
		})

		
	}
	//si el usuario existe

	const varificarPass = usuario.validarContrasena(password);

	if(!varificarPass){
		
		return done(null,false, {
			message: 'Contraseña incorrecta' // mensaje de error
		})
	}

	//si todo esta bien
	return done(null, usuario);

}));

//funciones para que passport pueda trabajar con los objetos JSON que devuelve la bd


passport.serializeUser((usuario, done) => done(null, usuario._id));
passport.deserializeUser(async (id, done) => {
	const usuario = await Usuarios.findById(id).exec();

	return done(null, usuario);
});


module.exports = passport;