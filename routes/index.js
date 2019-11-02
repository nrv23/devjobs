const express = require('express');
const router = express.Router(); // con esta linea invoco la funcion para el routing de los endpoinst
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
module.exports = () => { // al importar estas rutas y como esto exporta una funcion, entonces 
	// eb el index se importa como funcion y se ejecta automaticamente

    // aqui se hace el llamado de las rutas, dentro del llamado vienen las funciones de cada controlador

    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva', vacantesController.formNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.crearVacante);

    // para usar el res.render se debe usar un motor de plantillas para renderizar el html
	//retornar las rutas
	return router;
}