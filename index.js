const express = require('express');
const app = express();
const http= require('http');

app.use('/', (req, res)=>{
	res.send("Hola")
});



const server= http.createServer(app);


server.listen(3000,() =>{
	console.log("Escuchando en el puerto 3000");
})

