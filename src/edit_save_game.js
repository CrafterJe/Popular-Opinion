document.addEventListener("DOMContentLoaded", () => {
    const selectorRondas = document.getElementById("selectorRondas");
    const inputPregunta = document.getElementById("inputPregunta");
    const respuestasContainer = document.getElementById("respuestasContainer");
    const btnAgregarRespuesta = document.getElementById("btnAgregarRespuesta");
    const btnGuardarRonda = document.getElementById("btnGuardarRonda");
    const btnEliminarRonda = document.getElementById("btnEliminarRonda");
    const btnAgregarRonda = document.getElementById("btnAgregarRonda");
    const btnGuardarPartida = document.getElementById("btnGuardarPartida");
    const inputNombreArchivo = document.getElementById("nombreArchivo");
  
    let rondas = [];
    let rondaActual = 0;
  
    const partida = localStorage.getItem("partida_en_edicion");
    const nombrePartida = localStorage.getItem("nombre_partida");
    if (!partida || !nombrePartida) {
        mostrarToast("No se pudo cargar la partida.");
      window.location.href ="saved_games.html"
      return;
    }
  
    const datos = JSON.parse(partida);
    rondas = Array.isArray(datos) ? datos : datos.rondas;
    inputNombreArchivo.value = nombrePartida;
    actualizarSelector();
    mostrarRonda();
  
    function mostrarToast(mensaje) {
        let container = document.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          document.body.appendChild(container);
        }
      
        const toast = document.createElement('div');
        toast.className = 'toast-custom';
        toast.textContent = mensaje;
        container.appendChild(toast);
      
        setTimeout(() => {
          toast.remove();
          if (container.children.length === 0) {
            container.remove();
          }
        }, 3000);
      }
      
      
    function actualizarSelector() {
      selectorRondas.innerHTML = "";
      rondas.forEach((ronda, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `Ronda ${i + 1}`;
        selectorRondas.appendChild(opt);
      });
      selectorRondas.value = rondaActual;
    }
  
    function mostrarRonda() {
      const ronda = rondas[rondaActual];
      inputPregunta.value = ronda.pregunta;
      respuestasContainer.innerHTML = "";
  
      ronda.respuestas.forEach((resp, i) => {
        const div = document.createElement("div");
        div.className = "respuesta-item";
        div.innerHTML = `
          <input type="text" class="respuesta-texto" value="${resp.texto}" placeholder="Respuesta #${i + 1}">
          <input type="number" class="respuesta-puntos" value="${resp.puntos}" min="1" max="100">
          <button class="btnEliminar" style="display: ${i >= 3 ? 'inline-block' : 'none'}">Quitar</button>
        `;
  
        const btnEliminar = div.querySelector(".btnEliminar");
        btnEliminar.addEventListener("click", () => {
          if (respuestasContainer.childElementCount > 3) {
            div.remove();
            actualizarNumeracion();
          }
        });
  
        respuestasContainer.appendChild(div);
      });
    }
  
    function actualizarNumeracion() {
      const textos = respuestasContainer.querySelectorAll(".respuesta-texto");
      textos.forEach((input, i) => {
        input.placeholder = `Respuesta #${i + 1}`;
      });
    }
  
    btnAgregarRespuesta.addEventListener("click", () => {
      const total = respuestasContainer.childElementCount;
      if (total >= 10) return;
  
      const div = document.createElement("div");
      div.className = "respuesta-item";
      div.innerHTML = `
        <input type="text" class="respuesta-texto" placeholder="Respuesta #${total + 1}">
        <input type="number" class="respuesta-puntos" min="1" max="100">
        <button class="btnEliminar" style="display: inline-block">Quitar</button>
      `;
      const btnEliminar = div.querySelector(".btnEliminar");
      btnEliminar.addEventListener("click", () => {
        if (respuestasContainer.childElementCount > 3) {
          div.remove();
          actualizarNumeracion();
        }
      });
      respuestasContainer.appendChild(div);
    });
  
    btnGuardarRonda.addEventListener("click", () => {
      const pregunta = inputPregunta.value.trim();
      if (!pregunta) return mostrarToast("Escribe la pregunta.");
  
      const respuestas = [];
      const textos = respuestasContainer.querySelectorAll(".respuesta-texto");
      const puntos = respuestasContainer.querySelectorAll(".respuesta-puntos");
  
      for (let i = 0; i < textos.length; i++) {
        const texto = textos[i].value.trim();
        const punto = parseInt(puntos[i].value);
        if (!texto || isNaN(punto)) {
          return mostrarToast("Completa todas las respuestas con puntos válidos.");
        }
        respuestas.push({ texto, puntos: punto });
      }
  
      if (respuestas.length < 3 || respuestas.length > 10) {
        return mostrarToast("Debe haber entre 3 y 10 respuestas.");
      }
  
      rondas[rondaActual] = { pregunta, respuestas };
      mostrarToast("Ronda guardada.");
    });
  
    selectorRondas.addEventListener("change", () => {
      rondaActual = parseInt(selectorRondas.value);
      mostrarRonda();
    });
  
    btnEliminarRonda.addEventListener("click", () => {
      if (rondas.length <= 1) return mostrarToast("Debe haber al menos una ronda.");
      rondas.splice(rondaActual, 1);
      rondaActual = 0;
      actualizarSelector();
      mostrarRonda();
    });
  
    btnAgregarRonda.addEventListener("click", () => {
      rondas.push({
        pregunta: "",
        respuestas: [
          { texto: "", puntos: 0 },
          { texto: "", puntos: 0 },
          { texto: "", puntos: 0 }
        ]
      });
      rondaActual = rondas.length - 1;
      actualizarSelector();
      mostrarRonda();
    });
  
    btnGuardarPartida.addEventListener("click", () => {
        const nombre = inputNombreArchivo.value.endsWith('.json')
          ? inputNombreArchivo.value
          : `${inputNombreArchivo.value}.json`;
      
        const data = {
          actualizado: new Date().toISOString(),
          rondas
        };
      
        window.electronAPI.guardarJuegoUnico(nombre, data);
        mostrarToast("🎉 Partida guardada exitosamente.");
      });      
  });
  