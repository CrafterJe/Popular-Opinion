const { app, BrowserWindow } = require('electron');
const path = require('path'); 
const { ipcMain } = require('electron');
const fs = require('fs');
const dataPath = path.join(__dirname, 'data'); 

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
  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'public', 'index.html'));
  win.webContents.openDevTools();
}

/* Config */
ipcMain.on('guardar-juego-unico', (event, nombreOriginal, contenido) => {
    const dir = path.join(__dirname, 'data');
  
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  
    const extension = path.extname(nombreOriginal);
    const base = path.basename(nombreOriginal, extension);
  
    let nombreFinal = nombreOriginal;
    let contador = 1;
  
    while (fs.existsSync(path.join(dir, nombreFinal))) {
      nombreFinal = `${base} (${contador})${extension}`;
      contador++;
    }
  
    const ruta = path.join(dir, nombreFinal);
    const data = JSON.stringify(contenido, null, 2);
  
    fs.writeFile(ruta, data, (err) => {
      if (err) {
        console.error("Error al guardar partida:", err);
      } else {
        console.log("Guardado exitoso:", nombreFinal);
      }
    });
});
/* Saved Games */
ipcMain.handle('obtener-partidas', async () => {
    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
    const archivos = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'));
    return archivos;
  });
  
ipcMain.on('eliminar-partida', (event, nombre) => {
  const ruta = path.join(dataPath, nombre);
  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
    console.log(`Partida eliminada: ${nombre}`);
  }
});

ipcMain.handle('cargar-partida', async (event, nombre) => {
  const ruta = path.join(dataPath, nombre);
  if (fs.existsSync(ruta)) {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(contenido);
  }
  return null;
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
