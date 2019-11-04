const Vacante = require('../models/Vacantes');

exports.formNuevaVacante = (req, res) => {

	res.render('nuevaVacante',{
		nombrePagina: 'Nueva vacante',
		tagline: 'Completa el formulario para publicar la vacante'
	})
}

exports.crearVacante = async (req,res) => {

	const vacante = new Vacante(req.body); 
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
		nombrePagina: 'Editar - '+vacante.titulo
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
		res.redirect(`/vacantes/${vacanteActualizada.url}`);
	}
	
}