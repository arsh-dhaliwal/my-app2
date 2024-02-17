// status-indicator.js
// This script is responsible for updating the status indicators for the sensors
// based on the temperature readings and configured thresholds.

const { ipcRenderer } = require('electron');

// Configuration for status indicators
let statusConfig = {
  yellow: {
    percentageIncrease: 10, // Default X% increase for yellow status
    days: 3 // Default Y days for trend analysis
  },
  red: {
    threshold: 100 // Default temperature threshold for red status
  }
};

// Function to update the status indicator based on the sensor data
function updateStatusIndicator(sensorId, temperature) {
  const sensorCard = document.querySelector(`#sensor-card-${sensorId}`);
  const statusElement = sensorCard.querySelector('.status-indicator');
  const previousTemperature = sensorCard.dataset.previousTemperature;
  const threshold = sensorCard.dataset.temperatureThreshold;

  // Calculate the trend percentage increase
  const percentageIncrease = ((temperature - previousTemperature) / previousTemperature) * 100;

  // Determine the status color based on the temperature and trend
  let statusColor = 'green'; // Default status
  if (temperature >= threshold) {
    statusColor = 'red';
  } else if (percentageIncrease >= statusConfig.yellow.percentageIncrease) {
    statusColor = 'yellow';
  }

  // Update the status indicator color
  statusElement.style.backgroundColor = statusColor;

  // Update the previous temperature for the next comparison
  sensorCard.dataset.previousTemperature = temperature;

  // Send notification if status is red
  if (statusColor === 'red') {
    ipcRenderer.send('alarm-triggered', { sensorId, temperature });
  }
}

// Function to configure the status indicators
function configureStatusIndicators(config) {
  if (config.yellow) {
    statusConfig.yellow.percentageIncrease = config.yellow.percentageIncrease;
    statusConfig.yellow.days = config.yellow.days;
  }
  if (config.red) {
    statusConfig.red.threshold = config.red.threshold;
  }
}

// IPC event listener for temperature updates
ipcRenderer.on('temperature-update', (event, { sensorId, temperature }) => {
  updateStatusIndicator(sensorId, temperature);
});

// Export the configureStatusIndicators function for use in other modules
module.exports = {
  configureStatusIndicators
};