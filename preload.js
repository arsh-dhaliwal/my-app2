const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateTemperatureData: (callback) => ipcRenderer.on('temperature-update', callback),
  triggerAlarm: (callback) => ipcRenderer.on('alarm-triggered', callback),
  importDatabase: (callback) => ipcRenderer.on('database-imported', callback),
  exportDatabase: (callback) => ipcRenderer.on('database-exported', callback),
  sendNotification: (title, body) => ipcRenderer.send('send-notification', { title, body }),
  sendEmailAlert: (emailDetails) => ipcRenderer.send('send-email-alert', emailDetails),
  saveDatabaseState: () => ipcRenderer.invoke('save-database-state'),
  openDatabase: (filePath) => ipcRenderer.invoke('open-database', filePath),
  toggleTheme: (theme) => ipcRenderer.send('toggle-theme', theme),
  showSettings: () => ipcRenderer.send('show-settings'),
  showDemoMode: () => ipcRenderer.send('show-demo-mode'),
  convertTemperatureUnit: (unit) => ipcRenderer.invoke('convert-temperature-unit', unit),
  displayLicenseEULA: () => ipcRenderer.send('display-license-eula')
});