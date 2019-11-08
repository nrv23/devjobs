module.exports = {
	seleccionarSkills: (seleccionadas = [], opciones) =>{
		//selecionadas son los skills seleccionados que vienen de la bd
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        let html='';

        skills.forEach(skill => {
        	html+=`<li ${seleccionadas.includes(skill) ? 'class="activo"': ''}>${skill}</li>`;
        });
        //al comparar los skills seleccionados con la lista de skills si coincide alguno se le 
        //agrega la clave activo para mostrar que esta seleccionado

        //opciones va ser el sector de html donde voy a inyectar el contenido de los skills
        return opciones.fn().html = html;
	},
	tipoContrato: (seleccionado, opciones) =>{
		//opciones.fn() con la funcion fn muestro el codigo html donde se va a cargar o cambiar informacion
		
		return opciones.fn(this).replace(new RegExp(` value="${seleccionado}"`),'$& selected="selected"')
		// reemplazar usando una expresion regular que compare que si en el value existe el valor de la variable seleccionado, se agrega en la opcion el atributo selected
		//$& significa un string 
	},

	mostrarAlertas: (mensajes ={}, alertas)=>  {
		//mensajes, son texto de error o confirmacion
		//alertas, html para renderizar los mensajes

		const categoria =  Object.keys(mensajes);
		let html='';
		if(categoria.length){
			mensajes[categoria].forEach((mensaje)=> {
				// statements
				html+=`
					<div class="${categoria} alerta">
						${mensaje}
					</div>
				`;	
			});
		}
		//retornar el html

		return alertas.fn().html=html;
	}
}