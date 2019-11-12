const Usuarios = require('../models/Usuarios');
const multer = require('multer');

exports.formCrearCuenta = (req, res) => {
	
	//devolver la vista para crear la cuenta

	res.render('crearCuenta',{
		nombrePagina: 'Crear cuenta en DevJobs',
		'tagline' : 'Publica tus vacantes gratis'
	})	
}

exports.validarInformacion = (req, res, next) =>{ //middleware para validar que la informacion de los
	//forms sea correcta

	//sanitizar los campos

	req.sanitizeBody('nombre').escape(); //escapar el value, convierte los caracteres especiales en caracteres 
	// seguros para insertar en la bd
	req.sanitizeBody('email').escape();
	req.sanitizeBody('password').escape();  
	req.sanitizeBody('confirmar_password').escape();  
	//validar los campos que no esten vacios
	req.checkBody('nombre', 'El nombre es requerido').notEmpty();
	req.checkBody('email', 'El email debe ser valido').isEmail();
	req.checkBody('password', 'El password es requerido').notEmpty();
	req.checkBody('confirmar_password', 'La confirmación del password es requerida').notEmpty();

 	 //confirmar que el campo password y confirmar_password tengan el mismo valor
 	 req.checkBody('confirmar_password','No coincide el password').equals(req.body.password);

	const errores = req.validationErrors(); //req.validationErrors(); almacena los errores 

	if(errores) { // si hay errores

		req.flash('error', errores.map(error => error.msg)); //cargo los errores en la variable global de 
		//connnect flash y luego renderizo la vista de crear cuenta para mostrar los errores

		res.render('crearCuenta',{
			nombrePagina: 'Crear cuenta en DevJobs',
			tagline : 'Publica tus vacantes gratis',
			mensajes: req.flash()
		});

		return; // detener la demas ejecucion del codigo
	}
	
	next(); // seguir con el siguiente middleware
}

exports.crearCuenta = async (req, res, next) => {

	//const {nombre, email, password, confirmar_password} = req.body;

	const usuario = new Usuarios(req.body);

	try{

		await usuario.save();
		res.redirect('/iniciar-sesion')

	}catch(err){
		//err el parametro err del catch es el mensaje que estoy enviando desde el modelo de usuarios
		// cuando se intenta insertar un correo ya existente
		req.flash('error', err);
		res.redirect('/crear-cuenta');
	}
	
}


exports.formEditarPerfil = async (req, res, next) => {

	res.render('edtarPerfil',{
		nombrePagina: 'Editar información del perfil',
		usuario: req.user, // el request guardar la instancia del usuario logueado
		nombre: req.user.nombre,
		cerrarSesion: true
	})
}

exports.actualizarPerfil = async (req, res, next) => {
	  
	 const {email, password, nombre} = req.body;
	 const {_id } = req.user;

	 const usuario = await Usuarios.findById(_id);

	 usuario.nombre= nombre;
	 usuario.email = email;

	 if(password){
	 	usuario.password=password;
	 }

	await  usuario.save();

	req.flash('correcto','Perfil actualizado con éxito');
	res.redirect('/admin');
}


exports.validarPerfil = (req, res, next) => {
	
	req.sanitizeBody('email').escape();
	req.sanitizeBody('nombre').escape();  

	if(req.body.password){
		req.sanitizeBody('password').escape();
	}
	//validar los campos que no esten vacios
	req.checkBody('nombre', 'El nombre es requerido').notEmpty();
	req.checkBody('email', 'El email debe ser valido').isEmail();


	const errores = req.validationErrors();

	if(errores){

		req.flash('error', errores.map(error => error.msg));
		
		return res.render('edtarPerfil',{
			nombrePagina: 'Editar información del perfil',
			usuario: req.user, // el request guardar la instancia del usuario logueado
			nombre: req.user.nombre,
			cerrarSesion: true,
			mensajes: req.flash()
		})
	}

	next();
}

exports.subirImagen = (req, res, next) => {
	upload(req, res, function(error){
		if(error instanceof multer.MulterError){// convertir error a un error de multer para poder 
			//tratarlo

			return next();
		}

		next();
	})
}
const upload = multer