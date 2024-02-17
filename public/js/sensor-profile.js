// sensor-profile.js

const { ipcRenderer } = require('electron');
const db = require('../scripts/database.js');

// Function to add a new sensor profile to the database
function addSensorProfile(sensorData) {
  const insert = db.prepare('INSERT INTO Sensor (sensorName, sensorFamily, sensorType, sensorVariant, assetId, position) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run(sensorData.sensorName, sensorData.sensorFamily, sensorData.sensorType, sensorData.sensorVariant, sensorData.assetId, sensorData.position);
}

// Function to update an existing sensor profile in the database
function updateSensorProfile(sensorData) {
  const update = db.prepare('UPDATE Sensor SET sensorName = ?, sensorFamily = ?, sensorType = ?, sensorVariant = ?, assetId = ?, position = ? WHERE id = ?');
  update.run(sensorData.sensorName, sensorData.sensorFamily, sensorData.sensorType, sensorData.sensorVariant, sensorData.assetId, sensorData.position, sensorData.id);
}

// Function to delete a sensor profile from the database
function deleteSensorProfile(sensorId) {
  const del = db.prepare('DELETE FROM Sensor WHERE id = ?');
  del.run(sensorId);
}

// Function to get all sensor profiles from the database
function getAllSensorProfiles() {
  const selectAll = db.prepare('SELECT * FROM Sensor');
  return selectAll.all();
}

// Function to get a single sensor profile by its ID
function getSensorProfileById(sensorId) {
  const select = db.prepare('SELECT * FROM Sensor WHERE id = ?');
  return select.get(sensorId);
}

// Function to populate the sensor profile form with data
function populateSensorProfileForm(sensorId) {
  const sensorData = getSensorProfileById(sensorId);
  if (sensorData) {
    document.getElementById('sensor-name').value = sensorData.sensorName;
    document.getElementById('sensor-family').value = sensorData.sensorFamily;
    document.getElementById('sensor-type').value = sensorData.sensorType;
    document.getElementById('sensor-variant').value = sensorData.sensorVariant;
    document.getElementById('sensor-asset').value = sensorData.assetId;
    document.getElementById('sensor-position').value = sensorData.position;
  }
}

// Event listener for form submission
document.getElementById('sensor-profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const sensorData = {
    sensorName: document.getElementById('sensor-name').value,
    sensorFamily: document.getElementById('sensor-family').value,
    sensorType: document.getElementById('sensor-type').value,
    sensorVariant: document.getElementById('sensor-variant').value,
    assetId: document.getElementById('sensor-asset').value,
    position: document.getElementById('sensor-position').value,
    id: document.getElementById('sensor-id').value // Assuming there's a hidden input for sensor ID
  };

  if (sensorData.id) {
    updateSensorProfile(sensorData);
  } else {
    addSensorProfile(sensorData);
  }

  // Notify the main process to refresh the UI
  ipcRenderer.send('sensor-profile-updated');
});

// Event listener for delete button
document.getElementById('delete-sensor').addEventListener('click', () => {
  const sensorId = document.getElementById('sensor-id').value;
  deleteSensorProfile(sensorId);
  // Notify the main process to refresh the UI
  ipcRenderer.send('sensor-profile-deleted');
});

// Function to initialize the sensor profile form
function initSensorProfileForm() {
  // Populate the asset dropdown
  const assets = db.prepare('SELECT id, assetName FROM Asset').all();
  const assetSelect = document.getElementById('sensor-asset');
  assets.forEach(asset => {
    const option = document.createElement('option');
    option.value = asset.id;
    option.textContent = asset.assetName;
    assetSelect.appendChild(option);
  });
}

// Call the initialization function when the script loads
initSensorProfileForm();