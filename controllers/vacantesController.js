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