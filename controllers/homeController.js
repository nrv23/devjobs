exports.mostrarTrabajos = (req, res) =>{
	res.render('home',{
    		nombrePagina:'DevJobs',
    		tagline: 'Encuentra y publica trabajos para desarrolladores web',// variable que se va mostrar de forma condicional
    		barra: true, // el buscador de empleos se va mostrar dependiendo de la pagina donde esta navegando
    		boton: true // para crear nuevas vacantes de empleo, esta funcion es solo para la parte de administracion
    })
}