const { ipcRenderer } = require('electron');

// Function to create and show a modal for settings
function showSettingsModal() {
  let modal = document.createElement('div');
  modal.id = 'settings-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <div class="modal-header">
        <h2>App Configurations</h2>
      </div>
      <div class="modal-body">
        <div id="tabs">
          <button class="tablinks" onclick="openTab(event, 'Company')">Company</button>
          <button class="tablinks" onclick="openTab(event, 'Plant')">Plant</button>
          <button class="tablinks" onclick="openTab(event, 'Asset')">Asset</button>
          <button class="tablinks" onclick="openTab(event, 'Sensor')">Sensor</button>
        </div>
        <div id="Company" class="tabcontent">
          <h3>Company Profile</h3>
          <form id="company-profile-form"></form>
        </div>
        <div id="Plant" class="tabcontent">
          <h3>Plant Profile</h3>
          <form id="plant-profile-form"></form>
        </div>
        <div id="Asset" class="tabcontent">
          <h3>Asset Profile</h3>
          <form id="asset-profile-form"></form>
        </div>
        <div id="Sensor" class="tabcontent">
          <h3>Sensor Profile</h3>
          <form id="sensor-profile-form"></form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.close-button').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Function to open different tabs within the modal
  window.openTab = function (evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  };

  modal.style.display = 'block';
}

// Function to show the startup configuration popup
function showStartupConfigPopup() {
  ipcRenderer.send('show-startup-config-popup');
}

// Function to show the demo mode with mock data
function showDemoMode() {
  ipcRenderer.send('show-demo-mode');
}

// Function to display license and EULA information
function displayLicenseEULA() {
  ipcRenderer.send('display-license-eula');
}

// Event listeners for menu actions
ipcRenderer.on('open-settings', () => {
  showSettingsModal();
});

ipcRenderer.on('open-startup-config', () => {
  showStartupConfigPopup();
});

ipcRenderer.on('open-demo-mode', () => {
  showDemoMode();
});

ipcRenderer.on('open-license-eula', () => {
  displayLicenseEULA();
});