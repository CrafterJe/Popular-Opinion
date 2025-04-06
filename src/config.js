document.addEventListener("DOMContentLoaded", () => {
    const respuestasContainer = document.getElementById("respuestasContainer");
    const btnAgregarRespuesta = document.getElementById("btnAgregarRespuesta");
    const btnGuardarRonda = document.getElementById("btnGuardarRonda");
    const inputPregunta = document.getElementById("inputPregunta");

    let numRespuestas = 0;
    const maxRespuestas = 10;
    const rondasAgregadas = [];

    const partidaCargada = localStorage.getItem("partida_en_edicion");
 
    if (partidaCargada) {
        const datos = JSON.parse(partidaCargada);
        // Si datos es un objeto con una propiedad 'rondas' que es un array
        if (datos.rondas && Array.isArray(datos.rondas)) {
          rondasAgregadas.push(...datos.rondas);
        } 
        // Si datos es directamente un array
        else if (Array.isArray(datos)) {
          rondasAgregadas.push(...datos);
        }
        mostrarRondasAgregadas();
        // Si estamos editando y hay al menos una ronda, precargar la primera
if (rondasAgregadas.length > 0) {
    const primera = rondasAgregadas[0];
    inputPregunta.value = primera.pregunta;
  
    respuestasContainer.innerHTML = "";
    numRespuestas = 0;
  
    primera.respuestas.forEach((resp, i) => {
      const div = document.createElement("div");
      div.className = "respuesta-item";
      div.innerHTML = `
        <input type="text" placeholder="Respuesta #${i + 1}" class="respuesta-texto" value="${resp.texto}" />
        <input type="number" placeholder="Puntos" class="respuesta-puntos" min="1" max="100" value="${resp.puntos}" />
        <button class="btnEliminar" style="display: ${i >= 3 ? 'inline-block' : 'none'};">Quitar</button>
      `;
  
      const btnEliminar = div.querySelector(".btnEliminar");
      btnEliminar.addEventListener("click", () => {
        if (respuestasContainer.childElementCount > 3) {
          respuestasContainer.removeChild(div);
          numRespuestas--;
  
          const botones = respuestasContainer.querySelectorAll(".btnEliminar");
          if (respuestasContainer.childElementCount <= 3) {
            botones.forEach(b => b.style.display = "none");
          }
  
          // Reordenar placeholders
          const textos = respuestasContainer.querySelectorAll(".respuesta-texto");
          textos.forEach((input, j) => {
            input.placeholder = `Respuesta #${j + 1}`;
          });
        }
      });
  
      respuestasContainer.appendChild(div);
      numRespuestas++;
    });
  }
  
        localStorage.removeItem("partida_en_edicion");
      }

    function crearCampoRespuesta() {
        if (numRespuestas >= maxRespuestas) return;
    
        numRespuestas++; // Primero incrementamos para que el número sea correcto
    
        const div = document.createElement("div");
        div.className = "respuesta-item";
    
        div.innerHTML = `
          <input type="text" placeholder="Respuesta #${numRespuestas}" class="respuesta-texto" />
          <input type="number" placeholder="Puntos" class="respuesta-puntos" min="1" max="100" />
          <button class="btnEliminar">Quitar</button>
        `;
    
        const btnEliminar = div.querySelector(".btnEliminar");
    
        // Mostrar botón "Quitar" solo si hay más de 3 respuestas
        btnEliminar.style.display = respuestasContainer.childElementCount >= 3 ? "inline-block" : "none";
    
        btnEliminar.addEventListener("click", () => {
          if (respuestasContainer.childElementCount > 3) {
            respuestasContainer.removeChild(div);
            numRespuestas--;
        
            // Ocultar todos los botones si solo quedan 3
            if (respuestasContainer.childElementCount <= 3) {
              const botones = respuestasContainer.querySelectorAll(".btnEliminar");
              botones.forEach(b => (b.style.display = "none"));
            }
        
            // Reenumerar los placeholders después de eliminar
            const textos = respuestasContainer.querySelectorAll(".respuesta-texto");
            textos.forEach((input, i) => {
              input.placeholder = `Respuesta #${i + 1}`;
            });
          }
        });
    
        respuestasContainer.appendChild(div);
    
        // Mostrar todos los botones si hay más de 3
        if (respuestasContainer.childElementCount > 3) {
          const botones = respuestasContainer.querySelectorAll(".btnEliminar");
          botones.forEach(b => (b.style.display = "inline-block"));
        }
      }


    btnAgregarRespuesta.addEventListener("click", crearCampoRespuesta);

    // Crear mínimo 3 respuestas al iniciar
    for (let i = 0; i < 3; i++) {
        console.log("Creando respuesta #" + (i+1));
        crearCampoRespuesta();
      }

    btnGuardarRonda.addEventListener("click", () => {
        const pregunta = inputPregunta.value.trim();
        const respuestasTextos = document.querySelectorAll(".respuesta-texto");
        const respuestasPuntos = document.querySelectorAll(".respuesta-puntos");
    
        if (!pregunta) {
          alert("Por favor ingresa una pregunta.");
          return;
        }
    
        const respuestas = [];
    
        for (let i = 0; i < respuestasTextos.length; i++) {
          const texto = respuestasTextos[i].value.trim();
          const puntos = parseInt(respuestasPuntos[i].value);
        
          if (!texto || isNaN(puntos)) {
            alert("Todas las respuestas deben tener texto y puntos válidos.");
            return;
          }
      
          respuestas.push({ texto, puntos });
        }
    
        if (respuestas.length < 3 || respuestas.length > 10) {
          alert("Debes agregar entre 3 y 10 respuestas.");
          return;
        }
    
        // Guardar la ronda
        rondasAgregadas.push({
          pregunta,
          respuestas
        });
    
        // Limpiar inputs para la siguiente ronda
        inputPregunta.value = "";
        respuestasContainer.innerHTML = "";
        numRespuestas = 0;
        for (let i = 0; i < 3; i++) crearCampoRespuesta();
    
        mostrarRondasAgregadas();
        });
        function mostrarRondasAgregadas() {
          const lista = document.getElementById("listaRondas");
          lista.innerHTML = "";
        
          rondasAgregadas.forEach((ronda, index) => {
            const li = document.createElement("li");
            li.textContent = `Ronda ${index + 1}: ${ronda.pregunta} (${ronda.respuestas.length} respuestas)`;
            lista.appendChild(li);
        });
    }
    
    const btnGuardarJuego = document.getElementById("btnGuardarJuego");

    btnGuardarJuego.addEventListener("click", () => {
      if (rondasAgregadas.length === 0) {
        alert("Debes agregar al menos una ronda para guardar el juego.");
        return;
      }

      const nombreArchivo = document.getElementById("nombreArchivo").value.trim();

      if (!nombreArchivo) {
        alert("Debes ingresar un nombre para el archivo.");
        return;
      }

      // Adjuntamos fecha de modificación
      const contenido = {
        actualizado: new Date().toISOString(),
        rondas: rondasAgregadas
      };

      if (window.electronAPI?.guardarJuegoUnico) {
          window.electronAPI.guardarJuegoUnico(`${nombreArchivo}.json`, contenido);
          alert("🎉 Juego guardado correctamente.");
        } else {
          console.warn("⚠️ Estás en un navegador, no se puede guardar el archivo.");
          alert("Esta acción solo está disponible en la app de escritorio.");
        }
    });
});