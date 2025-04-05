const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    guardarJuego: (rondas) => ipcRenderer.send('guardar-juego', rondas),
    obtenerPartidas: () => ipcRenderer.invoke('obtener-partidas'),
    eliminarPartida: (nombre) => ipcRenderer.send('eliminar-partida', nombre),
    cargarPartida: (nombre) => ipcRenderer.invoke('cargar-partida', nombre),
    guardarJuegoUnico: (nombre, contenido) => ipcRenderer.send('guardar-juego-unico', nombre, contenido),
  });