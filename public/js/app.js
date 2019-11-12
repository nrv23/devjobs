// este archivo es como el index.js, aqui es donde se va ejecutar el codigo que se va usar para la parte
// del cliente
import axios from 'axios';
import Swal from 'sweetalert2';

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

	const listaVacantes = document.querySelector('.panel-administracion');

	if(listaVacantes){
		listaVacantes.addEventListener("click", accionesListado);
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

//eliminar vacante

const accionesListado = e => {

	e.preventDefault();

	if(e.target.dataset.eliminar){ // si le da click al boton de eliminar, obtener un id para eliminar e
		//el registro
		Swal.fire({
			  title: 'Está seguro(a)?',
			  text: "Si elimina una vacante no podrá ser recuperada",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Borrar',
			  cancelButtonText: 'Cancelar'
			}).then((result) => {
				
				const id = e.target.getAttribute('data-eliminar');
				const url=`${location.origin}/vacantes/eliminar/${id}`;
				
				axios.delete(url, {
				 params: { id }
				}).then(data => {
					console.log(data);
					if(data.status === 200){

						if (result.value) {
						    Swal.fire(
						      'Eliminar',
						     data.data.message,
						      'success'
						    )

						    //eliminar del dom
						    e.target.parentElement.parentElement.remove();
					    }
					}
	
				}).catch(() => {
					Swal.fire({
						type: 'error',
						title:'Error',
						text: 'Usted no permisos para realizar esta acción'
					})
				})
			})

		
	}else if(e.target.tagName === 'A'){ // si existe un enlace entonces redireccione al enlace
		//si le da click a otro boton que no sea el de eliminar lo redireccione al link
		window.location.href= e.target.href;
	}
}