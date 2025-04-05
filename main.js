const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 1300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.maximize();
  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'public', 'index.html'));
}

ipcMain.on('guardar-juego', (event, rondas) => {
    const ruta = path.join(__dirname, 'data', 'mi_juego.json');
    const data = JSON.stringify(rondas, null, 2);
  
    fs.writeFile(ruta, data, (err) => {
      if (err) {
        console.error('Error al guardar el juego:', err);
      } else {
        console.log('Juego guardado exitosamente en', ruta);
      }
    });
  });

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
