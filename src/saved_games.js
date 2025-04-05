document.addEventListener("DOMContentLoaded", () => {
    const listaPartidas = document.getElementById("listaPartidas");
  
    window.electronAPI.obtenerPartidas().then(archivos => {
      console.log("Archivos encontrados:", archivos); // Verifica si está funcionando
  
      if (archivos.length === 0) {
        listaPartidas.innerHTML = "<li>No hay partidas guardadas.</li>";
        return;
      }
  
      archivos.forEach(nombre => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${nombre}
          <button class="editar" data-file="${nombre}">📝 Editar</button>
          <button class="eliminar" data-file="${nombre}">🗑️ Eliminar</button>
        `;
        listaPartidas.appendChild(li);
      });
  
      // Botón Eliminar
      document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
          const nombre = btn.dataset.file;
          if (confirm(`¿Eliminar "${nombre}"?`)) {
            window.electronAPI.eliminarPartida(nombre);
            btn.parentElement.remove();
          }
        });
      });
  
      // Botón Editar
      document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", async () => {
          const nombre = btn.dataset.file;
          const contenido = await window.electronAPI.cargarPartida(nombre);
          localStorage.setItem("partida_en_edicion", JSON.stringify(contenido));
          localStorage.setItem("nombre_partida", nombre);
          window.location.href = "config.html";
        });
      });
    });
  });
  