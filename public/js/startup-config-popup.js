const { ipcRenderer } = require('electron');
const { showSettings } = require('./settings.js');

// Function to show the startup configuration popup
function showStartupConfigPopup() {
  // Create the modal element
  const modal = document.createElement('div');
  modal.id = 'startup-config-modal';
  modal.className = 'modal';

  // Modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modal.appendChild(modalContent);

  // Close button for the modal
  const closeButton = document.createElement('span');
  closeButton.className = 'close';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = function() {
    modal.style.display = 'none';
  };
  modalContent.appendChild(closeButton);

  // Title for the modal
  const title = document.createElement('h2');
  title.textContent = 'Initial Configuration';
  modalContent.appendChild(title);

  // Form for initial configuration
  const form = document.createElement('form');
  form.id = 'startup-config-form';
  modalContent.appendChild(form);

  // Company profile configuration
  const companyProfileButton = document.createElement('button');
  companyProfileButton.textContent = 'Company Profile';
  companyProfileButton.type = 'button';
  companyProfileButton.onclick = function() {
    showSettings('company-profile');
  };
  form.appendChild(companyProfileButton);

  // Plant profile configuration
  const plantProfileButton = document.createElement('button');
  plantProfileButton.textContent = 'Plant Profile';
  plantProfileButton.type = 'button';
  plantProfileButton.onclick = function() {
    showSettings('plant-profile');
  };
  form.appendChild(plantProfileButton);

  // Asset profile configuration
  const assetProfileButton = document.createElement('button');
  assetProfileButton.textContent = 'Asset Profile';
  assetProfileButton.type = 'button';
  assetProfileButton.onclick = function() {
    showSettings('asset-profile');
  };
  form.appendChild(assetProfileButton);

  // Sensor profile configuration
  const sensorProfileButton = document.createElement('button');
  sensorProfileButton.textContent = 'Sensor Profile';
  sensorProfileButton.type = 'button';
  sensorProfileButton.onclick = function() {
    showSettings('sensor-profile');
  };
  form.appendChild(sensorProfileButton);

  // Append the modal to the document body
  document.body.appendChild(modal);

  // Display the modal
  modal.style.display = 'block';
}

// Event listener for when the application is loaded
document.addEventListener('DOMContentLoaded', (event) => {
  // Check if it's the first time the application is started
  ipcRenderer.invoke('is-first-launch').then(isFirstLaunch => {
    if (isFirstLaunch) {
      showStartupConfigPopup();
    }
  });
});

// Export the function to be used in other modules
module.exports = {
  showStartupConfigPopup
};