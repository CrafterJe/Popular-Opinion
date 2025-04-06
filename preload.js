const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    guardarJuego: (rondas) => ipcRenderer.send('guardar-juego', rondas),
    obtenerPartidas: () => ipcRenderer.invoke('obtener-partidas'),
    eliminarPartida: (nombre) => ipcRenderer.send('eliminar-partida', nombre),
    cargarPartida: (nombre) => ipcRenderer.invoke('cargar-partida', nombre),
    guardarJuegoNuevo: (nombre, contenido) => ipcRenderer.send('guardar-juego-nuevo', nombre, contenido),
    guardarJuegoUnico: (nombre, contenido) => ipcRenderer.send('guardar-juego-unico', nombre, contenido),
  });