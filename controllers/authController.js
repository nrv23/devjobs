const passport = require('passport');

exports.formIniciarSesion = (req , res ) => {

	res.render('inicarSesion',{
		nombrePagina: 'Inicia sesión en devJobs'
	})	
}

exports.autenticarUsuario = passport.authenticate('local',{
	successRedirect: '/admin',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true, //mostrar mensajes de error con connect flash
	//failureFlash si esta propiedad esta como true, la aplicacion va mostrar 
	// los mensajes de error que se cargan en req.fash en la variable res.locals.mensajes
	// que es una variable global para toda la aplicacion
	badRequestMessage: 'Todos los campos son requeridos'
	//badRequestMessage con esta propìedad puedo setear un mensaje de error y usando fialureFlash, 
	//los mensajes se cargan en el req.flash y se muestran en el cliente.
	//badRequestMessage si se dejan los campos del login vacios se muestra el mensaje
})


exports.verificarUsuario = (req, res, next) => {

	if(!req.isAuthenticated()){ //req.isAuthenticated() metodo de passport que devuelve un booleano si esta
		// o no logueado
		return res.redirect('/iniciar-sesion');
	}

	return next();
}

exports.cerrarSesion = (req , res ) => {

	req.logout();
	req.flash('correcto', 'Has cerrado sesión correctamente');
	return res.redirect('/iniciar-sesion');
}