exports.formNuevaVacante = (req, res) => {

	res.render('nuevaVacante',{
		nombrePagina: 'Nueva vacante',
		tagline: 'Completa el formulario para publicar la vacante'
	})
}