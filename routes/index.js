const express = require('express');
const router = express.Router(); // con esta linea invoco la funcion para el routing de los endpoinst
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

module.exports = () => { // al importar estas rutas y como esto exporta una funcion, entonces 
	// eb el index se importa como funcion y se ejecta automaticamente

    // aqui se hace el llamado de las rutas, dentro del llamado vienen las funciones de cada controlador

    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva', authController.verificarUsuario, 
        vacantesController.formNuevaVacante);
    
    router.post('/vacantes/nueva', authController.verificarUsuario, 
        vacantesController.validarVacante,
        vacantesController.crearVacante);

    // para usar el res.render se debe usar un motor de plantillas para renderizar el html

    //mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //editar vacante

	router.get('/vacantes/editar/:url', 
        authController.verificarUsuario
        ,vacantesController.formEditarVacante);

	router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.validarVacante
        ,vacantesController.actualizarVacante);

    //eliminar vacante

    router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante);

	//crear cuenta 
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta', usuariosController.validarInformacion ,usuariosController.crearCuenta);
	
    //iniciar sesion
    router.get('/iniciar-sesion', authController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //administracion
    router.get('/admin', 
        authController.verificarUsuario
        ,adminController.mostrarPanel);

    //editar`Perfil del usuario

    router.get('/perfil/editar', authController.verificarUsuario,
                    usuariosController.formEditarPerfil);
    router.post('/perfil/editar', authController.verificarUsuario,
              // usuariosController.validarPerfil
                usuariosController.subirImagen
                ,usuariosController.actualizarPerfil);
    //cerrar sesion

    router.get('/cerrar-sesion',authController.verificarUsuario,
                authController.cerrarSesion)
    ///perfil/editar
    //retornar las rutas
	return router;
}