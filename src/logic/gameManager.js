export async function inicializarSelectorDePartidas() {
    const lista = document.getElementById("dropdownListaPartidas");
    const buscador = document.getElementById("buscadorPartidas");
    const ordenMenu = document.getElementById("ordenPartidasMenu");
    const textoOrden = document.getElementById("textoOrdenPartidas");
    const paginacion = document.getElementById("paginacionPartidas");
    const partidaInfo = document.getElementById("partidaSeleccionada");
    const btnIniciar = document.getElementById("btnIniciar");
  
    let partidas = [];
    let paginaActual = 1;
    let ordenActual = "recientes";
    const partidasPorPagina = 3;
    let partidaSeleccionadaNombre = null; // 👈 variable local temporal
  
    const archivos = await window.electronAPI.obtenerPartidas();
    if (!archivos || archivos.length === 0) {
      lista.innerHTML = `<li class="list-group-item text-muted">No hay partidas disponibles.</li>`;
      return;
    }
  
    for (const nombre of archivos) {
      const contenido = await window.electronAPI.cargarPartida(nombre);
      const fechaRaw = contenido.actualizado;
      const fecha = fechaRaw ? new Date(fechaRaw) : new Date();
      partidas.push({ nombre, fecha, contenido });
    }
  
    function renderLista() {
      const textoBusqueda = buscador.value.toLowerCase();
      const ordenSeleccionado = ordenActual;
  
      let filtradas = partidas.filter(p => p.nombre.toLowerCase().includes(textoBusqueda));
  
      filtradas.sort((a, b) => {
        return ordenSeleccionado === "recientes" ? b.fecha - a.fecha : a.fecha - b.fecha;
      });
  
      const totalPaginas = Math.ceil(filtradas.length / partidasPorPagina);
      if (paginaActual > totalPaginas) paginaActual = 1;
  
      const inicio = (paginaActual - 1) * partidasPorPagina;
      const pagina = filtradas.slice(inicio, inicio + partidasPorPagina);
  
      lista.innerHTML = "";
  
      if (pagina.length === 0) {
        lista.innerHTML = `<li class="list-group-item text-muted">No se encontraron partidas.</li>`;
        paginacion.innerHTML = "";
        return;
      }
  
      pagina.forEach(({ nombre, fecha, contenido }) => {
        const item = document.createElement("li");
        item.className = "list-group-item list-group-item-action";
        item.style.cursor = "pointer";
  
        if (nombre === partidaSeleccionadaNombre) {
          item.classList.add("selected"); // 👈 aplicar clase visual si ya estaba seleccionada
        }
  
        item.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>${nombre}</strong><br/>
              <small class="text-muted">🕒 ${fecha.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}</small>
            </div>
            <span class="text-primary">▶️</span>
          </div>
        `;
  
        item.addEventListener("click", () => {
          // quitar selección previa
          document.querySelectorAll("#dropdownListaPartidas .list-group-item").forEach(el => el.classList.remove("selected"));
          // seleccionar actual
          item.classList.add("selected");
  
          // guardar en memoria temporal
          partidaSeleccionadaNombre = nombre;
  
          // guardar solo el contenido (puedes mantener esto en localStorage si lo usas para jugar)
          localStorage.setItem("partida_en_juego", JSON.stringify(contenido));
          localStorage.setItem("nombre_partida", nombre);
  
          // mostrar y habilitar
          partidaInfo.textContent = `📄 Seleccionada: ${nombre}`;
          btnIniciar.disabled = false;
          btnIniciar.onclick = () => window.location.href = "play_round.html";
        });
  
        lista.appendChild(item);
      });
  
      renderPaginacion(totalPaginas);
    }
  
    function renderPaginacion(total) {
      paginacion.innerHTML = "";
  
      for (let i = 1; i <= total; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === paginaActual ? "btn-primary" : "btn-outline-light"}`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
          paginaActual = i;
          renderLista();
        });
        paginacion.appendChild(btn);
      }
    }
  
    buscador.addEventListener("input", () => {
      paginaActual = 1;
      renderLista();
    });
  
    ordenMenu.addEventListener("click", (e) => {
      const selected = e.target.closest("button");
      if (!selected) return;
  
      ordenActual = selected.dataset.orden;
      textoOrden.textContent = selected.textContent;
      paginaActual = 1;
      renderLista();
    });
  
    renderLista();
  }
  