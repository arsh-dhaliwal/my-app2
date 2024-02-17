// public/js/real-time-updater.js

const { ipcRenderer } = require('electron');
const betterSqlite3 = require('better-sqlite3');
const dbPath = 'db/thermwatch.tmdb';
const Chart = require('chart.js');

// Open the database
const db = new betterSqlite3(dbPath);

// Function to update the temperature data for all sensors in real-time
function updateTemperatureData() {
  // Query the database for the latest temperature data for all sensors
  const sensorsData = db.prepare('SELECT * FROM SensorData ORDER BY timestamp DESC LIMIT 1').all();

  // Update the UI with the new temperature data
  sensorsData.forEach(sensor => {
    const sensorCard = document.querySelector(`#sensor-card-${sensor.sensorId}`);
    const temperatureDisplay = sensorCard.querySelector('.temperature-value');
    const statusIndicator = sensorCard.querySelector('.status-indicator');

    // Convert temperature based on the current unit setting
    const temperature = convertTemperatureUnit(sensor.temperature, temperatureUnit);
    temperatureDisplay.textContent = `${temperature.toFixed(2)}°${temperatureUnit}`;

    // Update the status indicator color based on the alarm status
    statusIndicator.className = `status-indicator ${getAlarmStatus(sensor.alarmStatus)}`;
  });

  // Emit an event to update the charts with the new data
  ipcRenderer.send('temperature-update', sensorsData);
}

// Function to get the class name for the alarm status indicator
function getAlarmStatus(alarmStatus) {
  switch (alarmStatus) {
    case 'good':
      return 'status-green';
    case 'attention':
      return 'status-yellow';
    case 'intervention':
      return 'status-red';
    default:
      return 'status-unknown';
  }
}

// Function to convert temperature between Fahrenheit and Celsius
function convertTemperatureUnit(temperature, unit) {
  if (unit === 'F') {
    return (temperature * 9/5) + 32;
  } else {
    return (temperature - 32) * 5/9;
  }
}

// Set an interval to update the temperature data in real-time
setInterval(updateTemperatureData, 5000); // Update every 5 seconds

// Listen for temperature unit toggle changes
ipcRenderer.on('toggle-temperature-unit', (event, newUnit) => {
  temperatureUnit = newUnit;
  updateTemperatureData(); // Update the data immediately to reflect the new unit
});

// This file is responsible for updating the temperature data in real-time and updating the UI accordingly.
// It listens for changes in the temperature unit setting and updates the temperature displays in the sensor cards.
// It also updates the status indicators based on the alarm status of each sensor.