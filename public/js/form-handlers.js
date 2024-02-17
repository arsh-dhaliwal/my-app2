// This script handles form submissions for the ThermWatch application settings

const { ipcRenderer } = require('electron');
const { validateForm } = require('./validation.js');
const { saveDatabaseState, openDatabase } = require('./data-import-export.js');

// Function to handle company profile form submission
function handleCompanyProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const companyData = {
      companyName: form.companyName.value,
      address: form.address.value,
      city: form.city.value,
      stateProvince: form.stateProvince.value,
      country: form.country.value,
      zipPostalCode: form.zipPostalCode.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value
    };
    ipcRenderer.send('update-company-profile', companyData);
  }
}

// Function to handle plant profile form submission
function handlePlantProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const plantData = {
      plantName: form.plantName.value,
      address: form.address.value,
      city: form.city.value,
      stateProvince: form.stateProvince.value,
      country: form.country.value,
      zipPostalCode: form.zipPostalCode.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value
    };
    ipcRenderer.send('update-plant-profile', plantData);
  }
}

// Function to handle asset profile form submission
function handleAssetProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const assetData = {
      assetName: form.assetName.value,
      plantId: form.plantId.value,
      capacity: form.capacity.value,
      rating: form.rating.value,
      temperatureThreshold: form.temperatureThreshold.value
    };
    ipcRenderer.send('update-asset-profile', assetData);
  }
}

// Function to handle sensor profile form submission
function handleSensorProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const sensorData = {
      sensorName: form.sensorName.value,
      sensorFamily: form.sensorFamily.value,
      sensorType: form.sensorType.value,
      sensorVariant: form.sensorVariant.value,
      assetId: form.assetId.value,
      position: form.position.value
    };
    ipcRenderer.send('update-sensor-profile', sensorData);
  }
}

// Function to handle DAQ configuration form submission
function handleDAQConfigurationSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const daqConfig = {
      modbusConfig: form.modbusConfig.value,
      mqttConfig: form.mqttConfig.value
    };
    ipcRenderer.send('update-daq-configuration', daqConfig);
  }
}

// Function to handle alerts and alarms configuration form submission
function handleAlertsConfigurationSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (validateForm(form)) {
    const alertsConfig = {
      temperatureIncreasePercentage: form.temperatureIncreasePercentage.value,
      temperatureIncreaseDays: form.temperatureIncreaseDays.value,
      temperatureThreshold: form.temperatureThreshold.value
    };
    ipcRenderer.send('update-alerts-configuration', alertsConfig);
  }
}

// Function to handle database save action
function handleSaveDatabase(event) {
  event.preventDefault();
  saveDatabaseState();
}

// Function to handle database open action
function handleOpenDatabase(event) {
  event.preventDefault();
  openDatabase();
}

// Attach event listeners to forms
document.getElementById('company-profile-form').addEventListener('submit', handleCompanyProfileSubmit);
document.getElementById('plant-profile-form').addEventListener('submit', handlePlantProfileSubmit);
document.getElementById('asset-profile-form').addEventListener('submit', handleAssetProfileSubmit);
document.getElementById('sensor-profile-form').addEventListener('submit', handleSensorProfileSubmit);
document.getElementById('daq-configuration-form').addEventListener('submit', handleDAQConfigurationSubmit);
document.getElementById('alerts-configuration-form').addEventListener('submit', handleAlertsConfigurationSubmit);

// Attach event listeners to database actions
document.getElementById('save-database').addEventListener('click', handleSaveDatabase);
document.getElementById('open-database').addEventListener('click', handleOpenDatabase);