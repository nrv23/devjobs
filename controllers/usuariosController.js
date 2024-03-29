const Usuarios = require('../models/Usuarios');
const multer = require('multer');
const helper = require('../helpers/helper');



exports.subirImagen = (req, res, next) => {
	upload(req, res, function(error){
		if(error){
			if(error instanceof multer.MulterError){//si el error fue generado por multer
				if(error.code === 'LIMIT_FILE_SIZE'){
					req.flash('error', 'El tamaño es demasiado grande. Máximo 100KB');
				}else{
					req.flash('error', error.message);
				}
			}else { // si el error no fue generado por multer
				// cuando el error es generado por express se puede leer el mensaje 
				//usando la variable error.message
				req.flash('error', error.message);
			}
			res.redirect('/admin');
			return;
		}else{
			next();
		}
		
	});
	
}
const configMulter ={ // Objeto de configuracion para subida de archivos en multer
	//limitar tamaño de imagenes
	limits: { fileSize: 100000}, // 100 kbytes
	storage: fileStorage = multer.diskStorage({
		//dentro de la funcion diskStorage se pasan dos opciones
		//destination es el lugar donde van a estar almacenadas y filename el nombre del archivo

		destination: (req, file, callback) => {
			// se devuelve el callback para indicar que el proceso se esta ejecutando
			callback(null, __dirname+'../../public/uploads/perfiles');// recibe dos parametros, el primero es el error, en este caso es null y el segundo la ruta
			//del archivo	
		},
		filename: (req, file, callback) => {
			//obtener la extension del archivo

			const extension = file.mimetype.split('/')[1];
			

			callback(null, `${helper.getID()}.${extension}`);
		//	callback(null, filename )	// recibe dos parametros, el primero el error que en este caso es null y el archivo
		}
	}),//lugar donde se van a almacenar los archivos que se van a ir subiendo
	fileFilter(req, file, callback)  { // filtrar las imagenes
		if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){

			//permitir solamente imagenes de tipo png o jpeg

			callback(null, true); // se ejecuta si se cumple o no la condicion
			// si se cumple la condicion se envia null en primer parametro que es el error y true porque
			// el archivo es valido
		}else{
			callback(null, false);
		}
	} 
}


const upload = multer(configMulter).single('imagen'); //

//.single('imagen'); el parametro dentro de la funcion single es el campo imagen que trae la imagen que se va 
//cargar


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
		cerrarSesion: true,
		imagen: req.user.imagen
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

	 if(req.file){ // esta informacion ya viene validad con el middleware de subir imagen
	 	usuario.imagen = req.file.filename;
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
			mensajes: req.flash(),
			imagen: req.user.imagen
		})
	}

	next();
}

