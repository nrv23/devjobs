const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const emailFunc = require('../handlers/email');

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

exports.formRestablecerPassword = (req, res) => {

	res.render('resstablecerPassword',{
		nombrePagina: 'Reestablecer Contraseña',
		tagline: 'Si ya está registrado por favor ingrese su correo para proceder a reestablecer su conntraseña'
	})
}


exports.enviarToken = async (req, res) => {

	const {email} = req.body;

	if(email === ''){
		req.flash('error', 'El campo email es requerido');
			return res.render('resstablecerPassword',{
			nombrePagina: 'Reestablecer Contraseña',
			tagline: 'Si ya está registrado por favor ingrese su correo para proceder a reestablecer su contraseña',
			mensajes: req.flash()
		})	
	}

	const usuario = await Usuarios.findOne({email});

	if(!usuario){

		req.flash('error', 'El correo ingresado no pertence a ninguna cuenta');
		return res.redirect('/iniciar-sesion');
		
	}

	// si el usuario existe entonces generar token

	const time =  Date.now() + 3600000; // una hora en segundos
	const token = crypto.randomBytes(30).toString('hex'); // 60 caracteres

	usuario.token = token;
	usuario.expira = time;

	await usuario.save();

	//crear url con token para reestablecer el password

	const url =`http://${req.headers.host}/reestablecer-password/${token}`;

	//enviar email
	await emailFunc.enviar({
		usuario,
		subject: 'Password Reset',
		url,
		archivo: 'reset'
	});

	req.flash('correcto', 'revisa tu bandeja de entrada');
	res.redirect('/iniciar-sesion');
}

//TensorFlow Machine Learning Projects: Build 13 real-world projects with advanced numerical computations using the Python ecosystem