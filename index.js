const mongoose = require('mongoose');
//importar la conexion
require('./config/db');
const express = require('express');
const app = express();
const http= require('http');
const handlebars= require('express-handlebars');
require('dotenv').config({path:'variables.env'});
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const createErrors = require('http-errors');
//const multer = require('multer');
const expressValidator = require('express-validator');
const MongoStore = require('connect-mongo')(session); // pasarle los valores de la session al mongostore
const passport = require('./config/passport');
const routes = require('./routes/');
const port = process.env.PUERTO || 8000;

const server= http.createServer(app);

// habilitar bodyparser para leer el body y los datos que se van a subir como imagenes 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());

app.engine('handlebars',
	handlebars({
		defaultLayout: 'layout', // para usar handlebars se debe configurar una vista por default 
		// o tambien conocido como master page
		// se configura una carpeta llamada layouts dentrode la carpeta views y luego el archivo layout
		// que va ser el master page
		helpers: require('./helpers/handlebars') //habilitar helpers en handlebars, esta cargando
		// una funcion que se exporta para ejecutarse antes de que se ejecute la aplicacion
		// de manera que el helper va estar disponible para la aplicacion

	})
)

app.set('view engine','handlebars');// indicarle a express el template engine que va usar

//habilitar archivos estaticos

app.use(express.static(path.join(__dirname, 'public'))) // leer los archivos que son de la vista

app.use(cookieParser());
app.use(session({
	//firmar y mantener viva la session
	secret: process.env.SECRETO,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ // inciar una instancia
		// dentro de ella guardar la sessiond econexion a la bd de mongo
		mongooseConnection: mongoose.connection
	})
}))

//ejecutar passport y usar las sessiones en passport

app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // mensajes de alerta
//crear variables globales para toda la aplicacion

app.use((req, res, next) => {
	res.locals.mensajes = req.flash();
	next();
});

app.use('/',routes());// primero carga la ruta raiz del servidor y luego carga la ruta que se esta visitando
//configurar handlebars para poder usarlo

//manejo de errores 

app.use((req, res, next) => { // aqui es donde voy a manejar los errores
	next(createErrors(404,'No Encontrado'));
	//createErrors es una funcion para crear mensajes personalizados de errores, recibe dos parametros
	// el primero es el codigo de estado y el segundo es el mensaje
	// el 404 es cuando no se encuentra la url que se quiere visitar
})
//administro los errores
app.use((error, req, res) => {
	//crear variables locales para mostrar el error en uan vista

	res.locals.mensaje = error.message; // con el .message leo el mensaje del error
	const status = error.status || 500; //algunas middlewares o dependencias no van a generar
	//el error entonces si el error no esta presente el codigo de error va ser 500 sino va ser
	//error.status 
	res.status(status); // el servidor va saber que es un error
	res.render('error'); // mostrar el mensaje del error
})

server.listen(port,() =>{
	console.log(`Servidor escuchando en el puerto ${port}`);
}) 

