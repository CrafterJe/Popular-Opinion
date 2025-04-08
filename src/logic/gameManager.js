export async function inicializarSelectorDePartidas() {
    const lista = document.getElementById("dropdownListaPartidas");
    const buscador = document.getElementById("buscadorPartidas");
    const orden = document.getElementById("ordenPartidas");
    const paginacion = document.getElementById("paginacionPartidas");
    const partidaInfo = document.getElementById("partidaSeleccionada");
    const btnIniciar = document.getElementById("btnIniciar");
  
    let partidas = [];
    let paginaActual = 1;
    const partidasPorPagina = 3;
  
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
      const ordenSeleccionado = orden.value;
  
      let filtradas = partidas.filter(p => p.nombre.toLowerCase().includes(textoBusqueda));
  
      filtradas.sort((a, b) => {
        return ordenSeleccionado === "recientes" ? b.fecha - a.fecha : a.fecha - b.fecha;
      });
  
      const totalPaginas = Math.ceil(filtradas.length / partidasPorPagina);
      if (paginaActual > totalPaginas) paginaActual = 1;
  
      const inicio = (paginaActual - 1) * partidasPorPagina;
      const fin = inicio + partidasPorPagina;
      const pagina = filtradas.slice(inicio, fin);
  
      lista.innerHTML = "";
  
      if (pagina.length === 0) {
        lista.innerHTML = `<li class="list-group-item text-muted">No se encontraron partidas.</li>`;
      }
  
      pagina.forEach(({ nombre, fecha, contenido }) => {
        const item = document.createElement("li");
        item.className = "list-group-item list-group-item-action";
        item.style.cursor = "pointer";
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
          localStorage.setItem("partida_en_juego", JSON.stringify(contentido));
          localStorage.setItem("nombre_partida", nombre);
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
  
    orden.addEventListener("change", () => {
      paginaActual = 1;
      renderLista();
    });
  
    renderLista();
  }
  