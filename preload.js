const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  guardarJuego: (rondas) => ipcRenderer.send('guardar-juego', rondas)
});
