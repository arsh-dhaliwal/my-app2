const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { initializeDatabase } = require('./db/init_db.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

app.on('ready', () => {
  createWindow();
  initializeDatabase();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Import Database',
        click() {
          dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'ThermWatch Database', extensions: ['tmdb'] }],
          }).then(result => {
            if (!result.canceled) {
              ipcMain.emit('database-imported', result.filePaths[0]);
            }
          }).catch(err => {
            console.error('Failed to import database:', err);
          });
        },
      },
      {
        label: 'Export Database',
        click() {
          dialog.showSaveDialog({
            title: 'Save Database',
            defaultPath: 'database.tmdb',
            filters: [{ name: 'ThermWatch Database', extensions: ['tmdb'] }],
          }).then(result => {
            if (!result.canceled) {
              ipcMain.emit('database-exported', result.filePath);
            }
          }).catch(err => {
            console.error('Failed to export database:', err);
          });
        },
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Options',
    submenu: [
      {
        label: 'Settings',
        click() {
          ipcMain.emit('show-settings');
        },
      },
      {
        label: 'Demo Mode',
        click() {
          ipcMain.emit('show-demo-mode');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'License',
        click() {
          ipcMain.emit('display-license');
        },
      },
      {
        label: 'EULA',
        click() {
          ipcMain.emit('display-eula');
        },
      },
    ],
  },
];

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      { role: 'reload' },
    ],
  });
}