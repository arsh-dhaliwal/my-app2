// sensor-card.js
// This script is responsible for creating and updating the sensor cards on the dashboard page.

const { ipcRenderer } = require('electron');

// Function to create a sensor card element
function createSensorCard(sensorData) {
  const card = document.createElement('div');
  card.className = 'sensor-card';
  card.id = `sensor-${sensorData.id}`;

  const title = document.createElement('h3');
  title.textContent = sensorData.sensorName;
  card.appendChild(title);

  const temperature = document.createElement('p');
  temperature.className = 'temperature';
  temperature.textContent = `${sensorData.currentTemperature}°`;
  card.appendChild(temperature);

  const statusIndicator = document.createElement('div');
  statusIndicator.className = `status-indicator ${sensorData.status}`;
  card.appendChild(statusIndicator);

  return card;
}

// Function to update the sensor card with new data
function updateSensorCard(sensorData) {
  const card = document.getElementById(`sensor-${sensorData.id}`);
  if (card) {
    const temperature = card.querySelector('.temperature');
    temperature.textContent = `${sensorData.currentTemperature}°`;

    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = `status-indicator ${sensorData.status}`;
  }
}

// Listen for temperature updates from the main process
ipcRenderer.on('temperature-update', (event, sensorData) => {
  updateSensorCard(sensorData);
});

// Function to initialize sensor cards on the dashboard
function initializeSensorCards(sensors) {
  const container = document.getElementById('sensor-cards-container');
  container.innerHTML = ''; // Clear existing cards

  sensors.forEach(sensorData => {
    const card = createSensorCard(sensorData);
    container.appendChild(card);
  });
}

// Export the functions for use in other scripts
module.exports = {
  createSensorCard,
  updateSensorCard,
  initializeSensorCards
};