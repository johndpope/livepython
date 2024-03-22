const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let win;
let varInspector;

function openVariableInspector() {
  console.log('Opening Variable Inspector');
  varInspector = new BrowserWindow({
    x: 800,
    y: 0,
    width: 500,
    height: 800,
    title: "Variable Inspector"
  });

  varInspector.loadURL(url.format({
    pathname: path.join(__dirname, "dist", "variable_inspector.html"),
    protocol: "file:",
    slashes: true
  }));

  varInspector.on('closed', () => {
    console.log('Variable Inspector window closed');
    varInspector = null;
  });
}

function createWindow() {
  console.log('Creating main window');
  win = new BrowserWindow({
    x: 20,
    y: 0,
    width: 750,
    height: 1000,
    icon: path.join(__dirname, 'icon.png'),
    title: "Livepython"
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  ipcMain.on("command", (evt, msg) => {
    console.log('IPC command received:', msg);
    process.send(msg);
  });

  ipcMain.on("toggle_variable_inspector", (evt, msg) => {
    console.log('Toggling Variable Inspector');
    if (varInspector) {
      varInspector.close();
    } else {
      openVariableInspector();
    }
  });

  process.on('message', message => {
    console.log('Process message received:', message);
    const parsed = JSON.parse(message);
    if (parsed.type === 'finish') {
      console.log('Finish message received, quitting app');
      app.quit();
    }
    if (win) win.webContents.send('trace', { msg: message });
    if (varInspector) varInspector.webContents.send('trace', { msg: message });
  });

  win.on('closed', () => {
    console.log('Main window closed');
    win = null;
  });
}

app.on('ready', () => {
  console.log('App is ready, creating window');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows are closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (win === null) {
    createWindow();
  }
});
