document.addEventListener("DOMContentLoaded", () => {
    const listaPartidas = document.getElementById("listaPartidas");
  
    window.electronAPI.obtenerPartidas().then(archivos => {
      if (archivos.length === 0) {
        listaPartidas.innerHTML = "<li>No hay partidas guardadas.</li>";
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
  
        const li = document.createElement("li");
        li.classList.add("game-card");
        li.innerHTML = `
          <h3>📄 ${nombre}</h3>
          <small>🕒 Última modificación: ${fecha}</small>
          <div class="btns">
            <button class="editar" data-file="${nombre}">📝 Editar</button>
            <button class="eliminar" data-file="${nombre}">🗑️ Eliminar</button>
          </div>
        `;
        listaPartidas.appendChild(li);
      });
  
      // Botón Eliminar
      listaPartidas.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar")) {
          const nombre = e.target.dataset.file;
          if (confirm(`¿Eliminar "${nombre}"?`)) {
            window.electronAPI.eliminarPartida(nombre);
            e.target.closest("li").remove();
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
          window.location.href = "config.html";
        }
      });
    });
  });
  