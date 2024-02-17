const { app, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Function to read the license and EULA text
const readTextFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading file:', filePath);
    return 'File not found.';
  }
};

// Function to create the menu template
const createMenuTemplate = (mainWindow) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import Database',
          click() {
            mainWindow.webContents.send('database-imported');
          }
        },
        {
          label: 'Export Database',
          click() {
            mainWindow.webContents.send('database-exported');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Options',
      submenu: [
        {
          label: 'App Configurations',
          click() {
            mainWindow.webContents.send('showSettings');
          }
        },
        {
          label: 'DAQ Configuration',
          click() {
            mainWindow.webContents.send('configureDAQ');
          }
        },
        {
          label: 'Alerts and Alarms',
          click() {
            mainWindow.webContents.send('configureAlerts');
          }
        },
        { type: 'separator' },
        {
          label: 'Demo Mode',
          click() {
            mainWindow.webContents.send('showDemoMode');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Dark Mode',
          click() {
            mainWindow.webContents.send('toggleTheme');
          }
        },
        { type: 'separator' },
        {
          role: 'reload'
        },
        {
          role: 'toggledevtools'
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'License',
          click() {
            const licenseText = readTextFile(path.join(__dirname, '../LICENSE.txt'));
            shell.openExternal('data:text/plain;charset=utf-8,' + encodeURIComponent(licenseText));
          }
        },
        {
          label: 'EULA',
          click() {
            const eulaText = readTextFile(path.join(__dirname, '../EULA.txt'));
            shell.openExternal('data:text/plain;charset=utf-8,' + encodeURIComponent(eulaText));
          }
        }
      ]
    }
  ];

  return template;
};

// Function to set the application menu
const setAppMenu = (mainWindow) => {
  const menuTemplate = createMenuTemplate(mainWindow);
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setAppMenu
};