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
const MongoStore = require('connect-mongo')(session); // pasarle los valores de la session al mongostore
const routes = require('./routes/');
const port = process.env.PUERTO || 8000;

const server= http.createServer(app);
// habilitar bodyparser para leer el body y los datos que se van a subir como imagenes 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
app.use('/',routes());// primero carga la ruta raiz del servidor y luego carga la ruta que se esta visitando
//configurar handlebars para poder usarlo

server.listen(port,() =>{
	console.log(`Servidor escuchando en el puerto ${port}`);
}) 

