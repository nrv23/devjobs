const Vacante = require('../models/Vacantes');

exports.formNuevaVacante = (req, res) => {

	res.render('nuevaVacante',{
		nombrePagina: 'Nueva vacante',
		tagline: 'Completa el formulario para publicar la vacante',
		nombre: req.user.nombre,
		cerrarSesion: true
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

	const vacante = await Vacante.findOne({url});
	
	if(!vacante) return next();

	res.render('vacante',{
		vacante,
		nombrePagina: vacante.titulo,
		barra: true
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
		cerrarSesion: true
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

	console.log(id);


}
