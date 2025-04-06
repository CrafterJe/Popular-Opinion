document.addEventListener("DOMContentLoaded", () => {
    const btnAgregarRonda = document.getElementById("btnAgregarRonda");
    const btnGuardarPartida = document.getElementById("btnGuardarPartida");
    const inputNombreArchivo = document.getElementById("nombreArchivo");
    const accordion = document.getElementById("accordionRondas");
    const btnVolverMenu = document.getElementById("btnVolverMenu");
    const modal = new bootstrap.Modal(document.getElementById("modalConfirmarSalida"));
    const btnSalirSinGuardar = document.getElementById("btnSalirSinGuardar");

    let rondas = [];
    let cambiosPendientes = {};
  
    const partida = localStorage.getItem("partida_en_edicion");
    const nombrePartida = localStorage.getItem("nombre_partida");
  
    if (!partida || !nombrePartida) {
      mostrarToast("No se pudo cargar la partida.");
      window.location.href = "saved_games.html";
      return;
    }
  
    const datos = JSON.parse(partida);
    rondas = Array.isArray(datos) ? datos : datos.rondas;
    inputNombreArchivo.value = nombrePartida;
    renderizarTodasLasRondas();
  
    function mostrarToast(mensaje) {
      const container = document.querySelector('.toast-container');
      const toast = document.createElement("div");
      toast.className = "toast-custom bg-success text-white px-3 py-2 rounded mb-2 shadow";
      toast.innerText = mensaje;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  
    function renderizarTodasLasRondas() {
      accordion.innerHTML = "";
      rondas.forEach((ronda, i) => crearAccordionItem(i, ronda));
    }
  
    function crearAccordionItem(index, ronda) {
      const itemId = `ronda-${index}`;
      const headerId = `heading-${index}`;
      const collapseId = `collapse-${index}`;
  
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item text-dark bg-light";
  
      accordionItem.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button collapsed fw-bold toggle-collapse-btn" type="button" data-index="${index}">
            Ronda ${index + 1}: ${ronda.pregunta || "Sin pregunta"}
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-index="${index}">
          <div class="accordion-body">
            <label class="form-label fw-bold">Pregunta:</label>
            <input type="text" class="form-control pregunta-input mb-3" placeholder="Escribe la pregunta" value="${ronda.pregunta || ""}">

            <div class="row fw-bold text-secondary align-items-center mb-2">
              <div class="col-6">Respuestas:</div>
              <div class="col-4">Puntos</div>
              <div class="col-2 text-end"></div>
            </div>
            <div class="respuestas-container mb-3"></div>
            <div class="mb-3 d-flex flex-wrap gap-2">
              <button class="btn btn-outline-primary btn-sm btnAgregarRespuesta">➕ Respuesta</button>
              <button class="btn btn-success btn-sm btnGuardarRonda">💾 Guardar</button>
              <button class="btn btn-danger btn-sm btnEliminarRonda">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      `;
  
      const collapse = accordionItem.querySelector(".accordion-collapse");
      const preguntaInput = accordionItem.querySelector(".pregunta-input");
      const respuestasContainer = accordionItem.querySelector(".respuestas-container");
      const btnAgregarRespuesta = accordionItem.querySelector(".btnAgregarRespuesta");
      const btnGuardarRonda = accordionItem.querySelector(".btnGuardarRonda");
      const btnEliminarRonda = accordionItem.querySelector(".btnEliminarRonda");
      const toggleBtn = accordionItem.querySelector(".toggle-collapse-btn");
      const btnTitle = accordionItem.querySelector(".accordion-button");
      toggleBtn.addEventListener("click", () => {
        if (cambiosPendientes[index]) {
          mostrarToast("⚠️ Guarda los cambios antes de colapsar.");
          return;
        }
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
        bsCollapse.toggle();
      });
  
      collapse.addEventListener("show.bs.collapse", (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (cambiosPendientes[idx]) {
          e.preventDefault();
          mostrarToast("⚠️ Guarda los cambios antes de colapsar.");
          return false;
        }
      });
  
      preguntaInput.addEventListener("input", () => cambiosPendientes[index] = true);
  
      btnAgregarRespuesta.addEventListener("click", () => {
        if (respuestasContainer.children.length >= 10) return;
        const div = document.createElement("div");
        div.className = "d-flex align-items-center gap-2 mb-2";
        div.innerHTML = `
          <input type="text" class="form-control respuesta-texto" placeholder="Texto" />
          <input type="number" class="form-control respuesta-puntos" placeholder="Pts" min="1" max="100" style="width:100px" />
          <button class="btn btn-outline-danger btn-sm btnQuitar">🗑️</button>
        `;
        div.querySelector(".respuesta-texto").addEventListener("input", () => cambiosPendientes[index] = true);
        div.querySelector(".respuesta-puntos").addEventListener("input", () => cambiosPendientes[index] = true);
        div.querySelector(".btnQuitar").addEventListener("click", () => {
          div.remove();
          cambiosPendientes[index] = true;
        });
        respuestasContainer.appendChild(div);
        cambiosPendientes[index] = true;
      });
  
      ronda.respuestas.forEach((r, i) => {
        const div = document.createElement("div");
        div.className = "row align-items-center mb-2";
        div.innerHTML = `
          <div class="col-6">
          <input type="text" class="form-control respuesta-texto" value="${r.texto}" placeholder="Texto" />
          </div>
          <div class="col-4">
            <input type="number" class="form-control respuesta-puntos" value="${r.puntos}" min="1" max="100" class="form-control" />
          </div>
          <div class="col-2 text-end">
            <button class="btn btn-outline-danger btn-sm btnQuitar">🗑️</button>
          </div>
        `;
        div.querySelector(".respuesta-texto").addEventListener("input", () => cambiosPendientes[index] = true);
        div.querySelector(".respuesta-puntos").addEventListener("input", () => cambiosPendientes[index] = true);
        div.querySelector(".btnQuitar").addEventListener("click", () => {
          div.remove();
          cambiosPendientes[index] = true;
        });
        respuestasContainer.appendChild(div);
      });
  
      btnGuardarRonda.addEventListener("click", () => {
        const nuevaPregunta = preguntaInput.value.trim();
        const textos = accordionItem.querySelectorAll(".respuesta-texto");
        const puntos = accordionItem.querySelectorAll(".respuesta-puntos");
        const respuestas = [];
  
        if (!nuevaPregunta) return mostrarToast("Escribe la pregunta.");
  
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
  
        rondas[index] = { pregunta: nuevaPregunta, respuestas };
        cambiosPendientes[index] = false;
        actualizarTituloRonda();
        mostrarToast("✅ Ronda guardada.");
      });
  
      btnEliminarRonda.addEventListener("click", () => {
        if (rondas.length <= 1) return mostrarToast("Debe haber al menos una ronda.");
        rondas.splice(index, 1);
        renderizarTodasLasRondas();
      });

      function detectarCambios() {
        const preguntaActual = preguntaInput.value.trim();
        if (preguntaActual !== ronda.pregunta) return true;
      
        const textos = respuestasContainer.querySelectorAll(".respuesta-texto");
        const puntos = respuestasContainer.querySelectorAll(".respuesta-puntos");
      
        if (textos.length !== ronda.respuestas.length) return true;
      
        for (let i = 0; i < textos.length; i++) {
          const texto = textos[i].value.trim();
          const punto = parseInt(puntos[i].value);
          if (texto !== ronda.respuestas[i].texto || punto !== ronda.respuestas[i].puntos) {
            return true;
          }
        }
      
        return false;
      }
      
      const monitorearCambios = () => {
        cambiosPendientes[index] = detectarCambios();
        actualizarTituloRonda();
      };
      
      preguntaInput.addEventListener("input", monitorearCambios);
      respuestasContainer.addEventListener("input", monitorearCambios);
      respuestasContainer.addEventListener("change", monitorearCambios);
      
      function actualizarTituloRonda() {
        const pregunta = preguntaInput.value.trim() || "Sin pregunta";
        const base = `Ronda ${index + 1}: ${pregunta}`;
        const estado = cambiosPendientes[index]
          ? ` <span class="text-warning fw-semibold">(SIN GUARDAR)</span>`
          : "";
        btnTitle.innerHTML = base + estado;
      }          
  
      accordion.appendChild(accordionItem);
    }
  
    btnAgregarRonda.addEventListener("click", () => {
      rondas.push({
        pregunta: "",
        respuestas: [
          { texto: "", puntos: 0 },
          { texto: "", puntos: 0 },
          { texto: "", puntos: 0 }
        ]
      });
      renderizarTodasLasRondas();
      const nuevaId = `collapse-${rondas.length - 1}`;
      setTimeout(() => {
        const nueva = document.getElementById(nuevaId);
        if (nueva) new bootstrap.Collapse(nueva, { toggle: true });
      }, 50);
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

    btnVolverMenu.addEventListener("click", () => {
      const hayCambios = Object.values(cambiosPendientes).some(p => p === true);
      if (hayCambios) {
        modal.show();
      } else {
        window.location.href = "saved_games.html";
      }
    });
    
    btnSalirSinGuardar.addEventListener("click", () => {
      modal.hide();
      window.location.href = "saved_games.html";
    });
  });
  