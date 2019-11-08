// este archivo es como el index.js, aqui es donde se va ejecutar el codigo que se va usar para la parte
// del cliente
// para que webpack funcione, se debe cargar el archivo bundle al master page
document.addEventListener("DOMContentLoaded",() =>{
	//seleccionar los skills escogidos
	//limpiar las alertas 

	const alertas = document.querySelector('.alertas');

	if(alertas){ //si hay alertas mostrasdas
		limpiarAlertas();
	}


	const skills = document.querySelector('.lista-conocimientos'); 	

	if(skills){ // los skills no se van a mostrar en toda la aplicacion asi que solamente cuando existan

		skills.addEventListener('click', agregarSkills);

		//una vez que estamos en editar, llamar la funcion
		skillsSelecionados();
	}
})

const Skills = new Set();

const agregarSkills = (e) =>{

	if(e.target.tagName === 'LI'){

		if(e.target.classList.contains('activo')){ // quiere decir que el skill esta agregado
			const skill = e.target.textContent; 
			Skills.delete(skill); // borrar el elemento
			e.target.classList.remove('activo');// borrar la clase activo del boton
			
		}else{

			const skill = e.target.textContent; 
			Skills.add(skill);
			e.target.classList.add('activo'); // agregar la clase activo al boton
			
		}

		const skillsArray = [...Skills]; // sacar una copia del Set Skills y guardarlo como array en la
		//variable

		document.querySelector('#skills').value=skillsArray; // guardar los skills en el campo html
	}
}


const skillsSelecionados = () => {
	//traer todos los li que tengan la clase activo

	const seleccionados = Array.from(document.querySelectorAll(".lista-conocimientos .activo"));
	//Array.from para convertir una lista de objetos a array
	seleccionados.forEach(seleccionado => {
		Skills.add(seleccionado.textContent);
	});

	const skillsArray = [...Skills];

	document.querySelector('#skills').value=skillsArray;
	
}	

const limpiarAlertas = () =>{

	const alertas= document.querySelector('.alertas');

	const interval= setInterval(() => { // eliminar cada 2 segundos una alerta
		if(alertas.children.length > 0){
			alertas.removeChild(alertas.children[0]);
		}else{
			alertas.parentElement.removeChild(alertas);
			clearInterval(interval); //limpiar el intervalo para que setInterval
			// no se siga ejecutando cuando ya no hay nodos a eliminar
		}
	},2000);
}