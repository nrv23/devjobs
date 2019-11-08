const Vacantes = require('../models/Vacantes');

exports.mostrarPanel = async (req , res ) => {

	//req.user se guardar la referencia del usuario logueado
	const {_id, nombre} = req.user;

	const vacantes = await Vacantes.find({ autor:_id});

	res.render('administracion',{
		nombrePagina: 'Panel de Administración',
		tagline: 'Administrar Vacantes',
		vacantes,
		cerrarSesion: true, 
		nombre
	})
}