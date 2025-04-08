document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaPartidas");
  const buscador = document.getElementById("buscador");
  const ordenBtn = document.getElementById("ordenBtn");
  const ordenMenu = document.getElementById("ordenMenu");
  const paginacion = document.getElementById("paginacion");

  const partidasPorPagina = 6;
  let paginaActual = 1;
  let partidas = [];
  let ordenActual = "recientes";

  const archivos = await window.electronAPI.obtenerPartidas();

  for (const nombre of archivos) {
    const contenido = await window.electronAPI.cargarPartida(nombre);
    const fecha = contenido.actualizado ? new Date(contenido.actualizado) : new Date();
    partidas.push({ nombre, fecha, contenido });
  }

  function renderLista() {
    const filtro = buscador.value.toLowerCase();

    let filtradas = partidas.filter(p => p.nombre.toLowerCase().includes(filtro));

    filtradas.sort((a, b) => {
      return ordenActual === "recientes" ? b.fecha - a.fecha : a.fecha - b.fecha;
    });

    const totalPaginas = Math.ceil(filtradas.length / partidasPorPagina);
    if (paginaActual > totalPaginas) paginaActual = 1;

    const inicio = (paginaActual - 1) * partidasPorPagina;
    const visibles = filtradas.slice(inicio, inicio + partidasPorPagina);

    lista.innerHTML = "";
    if (visibles.length === 0) {
      lista.innerHTML = `<div class="alert alert-warning text-center">No se encontraron partidas.</div>`;
      paginacion.innerHTML = "";
      return;
    }

    visibles.forEach(({ nombre, fecha }) => {
      const card = document.createElement("div");
      card.className = "card text-bg-secondary shadow-sm card-partida";

      card.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 class="card-title mb-1">📄 ${nombre}</h5>
            <p class="card-text"><small class="text-light">🕒 Última modificación: ${fecha.toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short"
            })}</small></p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-warning editar" data-file="${nombre}">📝 Editar</button>
            <button class="btn btn-outline-danger eliminar" data-file="${nombre}">🗑️ Eliminar</button>
          </div>
        </div>
      `;
      lista.appendChild(card);
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

  lista.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const nombre = btn.dataset.file;

    if (btn.classList.contains("eliminar")) {
      if (confirm(`¿Eliminar "${nombre}"?`)) {
        await window.electronAPI.eliminarPartida(nombre);
        partidas = partidas.filter(p => p.nombre !== nombre);
        renderLista();
      }
    }

    if (btn.classList.contains("editar")) {
      const contenido = await window.electronAPI.cargarPartida(nombre);
      localStorage.setItem("partida_en_edicion", JSON.stringify(contenido));
      localStorage.setItem("nombre_partida", nombre);
      window.location.href = "edit_saved_games.html";
    }
  });

  buscador.addEventListener("input", () => {
    paginaActual = 1;
    renderLista();
  });

  ordenMenu.addEventListener("click", (e) => {
    const selected = e.target.closest("button");
    if (!selected) return;

    ordenActual = selected.dataset.orden;
    ordenBtn.textContent = selected.textContent;
    paginaActual = 1;
    renderLista();
  });

  renderLista();
});
