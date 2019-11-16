const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars'); // para configurar una plantilla para correos 
//usando handlebars
const util = require('util');
const path = require('path');
const {host, pass, user, port} = emailConfig;

let transport = nodemailer.createTransport({
	host,
	port,
	auth :{// aqui se pasan los datos para autenticar la cuenta de correo
		user,
		pass
	}

});

//utilizar template de handlebars para enviar correos
const configHbs= { // configuracion para plantilla de handlebars para correo
	'viewEngine': {
		extName: '.handlebars',
		partialsDir: __dirname+'/../views/emails',
		layoutsDir: __dirname+'/../views/emails',
		defaultLayout: 'reset.handlebars'
	},
	viewPath: __dirname+'/../views/emails',
	extName: '.handlebars'
};

transport.use('compile', hbs(configHbs)); 

exports.enviar = async opciones => {
	

		const opcionesEmail =  {
			from: 'devjobs <noreply@devjobs.com>',
			to: opciones.usuario.email,
			subject: opciones.subject,
			template: opciones.archivo,
			context:{
				resetUrl : opciones.url
			}
		}

		const sendMail = util.promisify(transport.sendMail,  transport);

		return sendMail.call(transport, opcionesEmail); // de esta manera ahora si devuelve una promesa

}