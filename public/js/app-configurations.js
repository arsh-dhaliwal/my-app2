// This script handles the app configurations for the ThermWatch application.
// It provides functionality to open and submit forms for company, plant, asset, and sensor profiles.

const { ipcRenderer } = require('electron');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');
const { openDatabase, saveDatabaseState } = require('../scripts/data-import-export.js');
const { validateForm } = require('../scripts/validation.js');

// Function to show the settings modal with the appropriate form
function showSettings(tab) {
  const settingsModal = document.getElementById('settings-modal');
  settingsModal.style.display = 'block';
  switch (tab) {
    case 'company':
      document.getElementById('company-profile-form').style.display = 'block';
      break;
    case 'plant':
      document.getElementById('plant-profile-form').style.display = 'block';
      break;
    case 'asset':
      document.getElementById('asset-profile-form').style.display = 'block';
      break;
    case 'sensor':
      document.getElementById('sensor-profile-form').style.display = 'block';
      break;
    default:
      console.error('Invalid settings tab specified');
  }
}

// Function to handle form submission for app configurations
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const isValid = validateForm(form);
  if (isValid) {
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    ipcRenderer.send('form-submission', formProps);
    form.reset();
    alert('Configuration saved successfully!');
  } else {
    alert('Please fill out all required fields correctly.');
  }
}

// Event listeners for form submissions
document.getElementById('company-profile-form').addEventListener('submit', handleFormSubmit);
document.getElementById('plant-profile-form').addEventListener('submit', handleFormSubmit);
document.getElementById('asset-profile-form').addEventListener('submit', handleFormSubmit);
document.getElementById('sensor-profile-form').addEventListener('submit', handleFormSubmit);

// Function to close the settings modal
function closeSettings() {
  const settingsModal = document.getElementById('settings-modal');
  settingsModal.style.display = 'none';
  // Hide all forms within the modal
  const forms = settingsModal.getElementsByTagName('form');
  for (let form of forms) {
    form.style.display = 'none';
  }
}

// Event listener for closing the settings modal
document.getElementById('settings-modal').addEventListener('click', (event) => {
  if (event.target === document.getElementById('settings-modal')) {
    closeSettings();
  }
});

// Function to initialize app configurations on first start
function showStartupConfigPopup() {
  showSettings('company');
}

// Export functions for use in other modules
module.exports = {
  showSettings,
  closeSettings,
  showStartupConfigPopup
};