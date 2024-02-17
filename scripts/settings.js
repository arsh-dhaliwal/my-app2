const { ipcRenderer } = require('electron');
const db = require('./database.js');

// Function to show settings modal
function showSettings() {
  const settingsModal = document.getElementById('settings-modal');
  settingsModal.classList.add('is-active');
}

// Function to close settings modal
function closeSettings() {
  const settingsModal = document.getElementById('settings-modal');
  settingsModal.classList.remove('is-active');
}

// Function to save company profile settings
function saveCompanyProfile(event) {
  event.preventDefault();
  const companyProfile = {
    companyName: document.getElementById('company-name').value,
    address: document.getElementById('company-address').value,
    city: document.getElementById('company-city').value,
    stateProvince: document.getElementById('company-state-province').value,
    country: document.getElementById('company-country').value,
    zipPostalCode: document.getElementById('company-zip-postal-code').value,
    phoneNumber: document.getElementById('company-phone-number').value,
    email: document.getElementById('company-email').value
  };
  db.saveCompanyProfile(companyProfile);
  closeSettings();
}

// Function to save plant profile settings
function savePlantProfile(event) {
  event.preventDefault();
  const plantProfile = {
    plantName: document.getElementById('plant-name').value,
    address: document.getElementById('plant-address').value,
    city: document.getElementById('plant-city').value,
    stateProvince: document.getElementById('plant-state-province').value,
    country: document.getElementById('plant-country').value,
    zipPostalCode: document.getElementById('plant-zip-postal-code').value,
    phoneNumber: document.getElementById('plant-phone-number').value,
    email: document.getElementById('plant-email').value
  };
  db.savePlantProfile(plantProfile);
  closeSettings();
}

// Function to save asset profile settings
function saveAssetProfile(event) {
  event.preventDefault();
  const assetProfile = {
    assetName: document.getElementById('asset-name').value,
    plantId: document.getElementById('asset-plant-id').value,
    capacity: document.getElementById('asset-capacity').value,
    rating: document.getElementById('asset-rating').value,
    temperatureThreshold: document.getElementById('asset-temperature-threshold').value
  };
  db.saveAssetProfile(assetProfile);
  closeSettings();
}

// Function to save sensor profile settings
function saveSensorProfile(event) {
  event.preventDefault();
  const sensorProfile = {
    sensorName: document.getElementById('sensor-name').value,
    sensorFamily: document.getElementById('sensor-family').value,
    sensorType: document.getElementById('sensor-type').value,
    sensorVariant: document.getElementById('sensor-variant').value,
    assetId: document.getElementById('sensor-asset-id').value,
    position: document.getElementById('sensor-position').value
  };
  db.saveSensorProfile(sensorProfile);
  closeSettings();
}

// Function to handle settings form submission
function handleSettingsFormSubmit(event) {
  const formId = event.target.id;
  switch (formId) {
    case 'company-profile-form':
      saveCompanyProfile(event);
      break;
    case 'plant-profile-form':
      savePlantProfile(event);
      break;
    case 'asset-profile-form':
      saveAssetProfile(event);
      break;
    case 'sensor-profile-form':
      saveSensorProfile(event);
      break;
    default:
      console.error('Unknown form submission:', formId);
  }
}

// Event listeners for settings form submissions
document.getElementById('company-profile-form').addEventListener('submit', handleSettingsFormSubmit);
document.getElementById('plant-profile-form').addEventListener('submit', handleSettingsFormSubmit);
document.getElementById('asset-profile-form').addEventListener('submit', handleSettingsFormSubmit);
document.getElementById('sensor-profile-form').addEventListener('submit', handleSettingsFormSubmit);

// Event listener for settings modal close button
document.querySelector('.modal-close').addEventListener('click', closeSettings);

module.exports = {
  showSettings,
  closeSettings
};