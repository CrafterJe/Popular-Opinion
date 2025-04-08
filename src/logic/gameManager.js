export async function inicializarSelectorDePartidas() {
    const lista = document.getElementById("dropdownListaPartidas");
    const buscador = document.getElementById("buscadorPartidas");
    const orden = document.getElementById("ordenPartidas");
    const partidaInfo = document.getElementById("partidaSeleccionada");
    const btnIniciar = document.getElementById("btnIniciar");
  
    let partidas = [];
  
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
        if (ordenSeleccionado === "recientes") {
          return b.fecha - a.fecha;
        } else {
          return a.fecha - b.fecha;
        }
      });
  
      lista.innerHTML = "";
  
      if (filtradas.length === 0) {
        lista.innerHTML = `<li class="list-group-item text-muted">No se encontraron partidas.</li>`;
        return;
      }
  
      filtradas.forEach(({ nombre, fecha, contenido }) => {
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
          localStorage.setItem("partida_en_juego", JSON.stringify(contenido));
          localStorage.setItem("nombre_partida", nombre);
          partidaInfo.textContent = `📄 Seleccionada: ${nombre}`;
          btnIniciar.disabled = false;
          btnIniciar.onclick = () => window.location.href = "play_round.html";
        });
        lista.appendChild(item);
      });
    }
  
    buscador.addEventListener("input", renderLista);
    orden.addEventListener("change", renderLista);
    renderLista();
  }
  