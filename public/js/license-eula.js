const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');

const licenseFilePath = path.join(__dirname, '..', '..', 'LICENSE.txt');
const eulaFilePath = path.join(__dirname, '..', '..', 'EULA.txt');

function showLicense() {
  fs.readFile(licenseFilePath, 'utf8', (err, data) => {
    if (err) {
      dialog.showErrorBox('Error', 'Unable to load the license file.');
      return;
    }
    dialog.showMessageBox({
      type: 'info',
      title: 'License',
      message: 'ThermWatch License',
      detail: data,
      buttons: ['OK'],
      defaultId: 0
    });
  });
}

function showEULA() {
  fs.readFile(eulaFilePath, 'utf8', (err, data) => {
    if (err) {
      dialog.showErrorBox('Error', 'Unable to load the EULA file.');
      return;
    }
    dialog.showMessageBox({
      type: 'info',
      title: 'End User License Agreement (EULA)',
      message: 'ThermWatch EULA',
      detail: data,
      buttons: ['OK'],
      defaultId: 0
    });
  });
}

module.exports = {
  showLicense,
  showEULA
};