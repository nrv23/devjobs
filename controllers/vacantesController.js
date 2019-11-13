const Vacante = require('../models/Vacantes');
const multer = require('multer');
const helper = require('../helpers/helper');

exports.subirCV= (req, res, next) => { // subir archivos pdf al servidor
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
			res.redirect('back'); // si hay un error redirige a la misma pagina
			return;
		}else{
			next();
		}
		
	});
}

const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv');
        }, 
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${helper.getID()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf') {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else { //enviar un mensaje de error
            cb(new Error('Formato No Válido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('cv');

exports.formNuevaVacante = (req, res) => {

	res.render('nuevaVacante',{
		nombrePagina: 'Nueva vacante',
		tagline: 'Completa el formulario para publicar la vacante',
		nombre: req.user.nombre,
		cerrarSesion: true,
		imagen: req.user.imagen
	})
}

exports.crearVacante = async (req,res) => {

	const vacante = new Vacante(req.body); 
	//asignar el id de referencia a la vacante del usuario que la creó

	vacante.autor = req.user._id;
	// crear un array de skills
	vacante.skills = req.body.skills.split(','); // al agregar un split a un string genera un array 

	const nuevaVacante = await vacante.save();

	res.redirect(`/vacantes/${vacante.url}`);
}


exports.mostrarVacante = async (req, res, next) => {

	const {url}=req.params;

	const vacante = await Vacante.findOne({url}).populate('autor'); 

	//.populate basicamente es como hacer un join de sql, usando la columna autor compara con la tabla
	// usuarios y se trae la fila que pertenece al id de autor guardado en vacantes
	if(!vacante) return next();

	res.render('vacante',{
		vacante,
		nombrePagina: vacante.titulo,
		barra: true,
		imagen: req.user.imagen
	})
}

exports.formEditarVacante = async (req, res, next) => {

	const {url}=req.params;

	const vacante = await Vacante.findOne({url});
	
	if(!vacante) return next();

	res.render('editar-vacante',{
		vacante,
		nombrePagina: 'Editar - '+vacante.titulo,
		nombre: req.user.nombre,
		cerrarSesion: true,
		imagen: req.user.imagen
	})
}


exports.actualizarVacante = async (req, res) => {

	const {url} = req.params;
	let vacante = req.body;
	vacante.skills= req.body.skills.split(',');//generar un array de skills

	const vacanteActualizada = await Vacante.findOneAndUpdate({url}, vacante, {
		new: true, // devolver el registro actualizado
		runValidators: true
	});

	if(vacanteActualizada){
		req.flash('correcto', 'Vacante actualizada correctamente');
		res.redirect(`/vacantes/${vacanteActualizada.url}`);
	}
	
}

// validar y sanitizar los campos de las nuevas vacantes

exports.validarVacante =  (req, res, next) => {
	//sanitizar los campos

	req.sanitizeBody('titulo').escape();
	req.sanitizeBody('empresa').escape();
	req.sanitizeBody('ubicacion').escape();
	req.sanitizeBody('salario').escape();
	req.sanitizeBody('contrato').escape();
	req.sanitizeBody('skills').escape();

	//validar los campos que no esten vacios o que traigan valores definidos

	req.checkBody('titulo', 'El titulo es requerido').notEmpty();
	req.checkBody('empresa', 'La empresa es requerida').notEmpty();
	req.checkBody('ubicacion', 'La ubicacion es requerida').notEmpty();
	req.checkBody('contrato', 'Seleccione un tipo de contrato').notEmpty();
	req.checkBody('skills', 'Agrega las habilidades para la vacante').notEmpty();


	//almacenar errores

	const errores = req.validationErrors();

	if(errores){
		req.flash('error', errores.map(error => error.msg));

		res.render('nuevaVacante',{
			nombrePagina: 'Nueva vacante',
			tagline: 'Completa el formulario para publicar la vacante',
			nombre: req.user.nombre,
			cerrarSesion: true,
			mensajes: req.flash()
		})
	}

	next();
}

exports.eliminarVacante = async (req, res) => {

	const {id } = req.params;

	const vacante = await Vacante.findOne({_id: id});
	if(!vacante){
		return req.flash('error', 'La vacante que intenta eliminar no existe');
		res.redirect('/admin');
	}
	//verificar que el usuario que creó la vacante sea quien la pueda borrar
	if(verificarAutor(vacante, req.user)){
		//req.user guarda la instancia del usuario logueado
		await vacante.remove(); // la variable vacante guarda la instancia del modelo Vacantes por 
		//lo tanto no es necesario pasar un filtro
		return res.status(200).send({message: 'Vacante elinada con éxito'});
	}else{
		return res.status(500).send({message: 'Usted no está autorizado(a) para realizar esta accción'});
	}
}

exports.guardarCandidato = async (req, res, next) => {

	const {url} =req.params;
	const {nombre, email} = req.body;
	const vacante = await Vacante.findOne({url});

	if(!vacante) return next();
	//console.log(req.file);

	const nuevoCandidato = {
		nombre,
		email,
		cv: req.file.filename
	};

	vacante.candidatos.push(nuevoCandidato);

	await vacante.save();

	req.flash('correcto', 'Se ha enviado su información');
	res.redirect('/');
}


const verificarAutor = (vacante = {}, usuario ={}) => (!vacante.autor.equals(usuario._id)) ? false : true;

