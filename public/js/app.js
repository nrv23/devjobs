// este archivo es como el index.js, aqui es donde se va ejecutar el codigo que se va usar para la parte
// del cliente
// para que webpack funcione, se debe cargar el archivo bundle al master page
document.addEventListener("DOMContentLoaded",() =>{
	//seleccionar los skills escogidos

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