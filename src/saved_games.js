document.addEventListener("DOMContentLoaded", () => {
    const listaPartidas = document.getElementById("listaPartidas");
  
    window.electronAPI.obtenerPartidas().then(archivos => {
      if (archivos.length === 0) {
        listaPartidas.innerHTML = `<div class="alert alert-warning text-center">No hay partidas guardadas.</div>`;
        return;
      }
  
      archivos.forEach(async (nombre) => {
        const contenido = await window.electronAPI.cargarPartida(nombre);
        const fechaRaw = contenido.actualizado;
        const fecha = fechaRaw
          ? new Date(fechaRaw).toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "Fecha desconocida";
  
        const card = document.createElement("div");
        card.className = "card text-bg-secondary shadow-sm";
  
        card.innerHTML = `
          <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 class="card-title mb-1">📄 ${nombre}</h5>
              <p class="card-text"><small class="text-light">🕒 Última modificación: ${fecha}</small></p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-warning editar" data-file="${nombre}">📝 Editar</button>
              <button class="btn btn-outline-danger eliminar" data-file="${nombre}">🗑️ Eliminar</button>
            </div>
          </div>
        `;
  
        listaPartidas.appendChild(card);
      });
  
      // Botón Eliminar
      listaPartidas.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar")) {
          const nombre = e.target.dataset.file;
          if (confirm(`¿Eliminar "${nombre}"?`)) {
            window.electronAPI.eliminarPartida(nombre);
            e.target.closest(".card").remove();
          }
        }
      });
  
      // Botón Editar
      listaPartidas.addEventListener("click", async (e) => {
        if (e.target.classList.contains("editar")) {
          const nombre = e.target.dataset.file;
          const contenido = await window.electronAPI.cargarPartida(nombre);
          localStorage.setItem("partida_en_edicion", JSON.stringify(contenido));
          localStorage.setItem("nombre_partida", nombre);
          window.location.href = "edit_saved_games.html";
        }
      });
    });
  });
  