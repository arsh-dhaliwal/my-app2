// alerts-configurations.js

const { ipcRenderer } = require('electron');
const db = require('../scripts/database.js');

// Configuration for alerts and alarms
const alertConfig = {
  yellowAlertPercentage: 10, // Default percentage for yellow alert
  yellowAlertDays: 3, // Default number of days to check for average temperature trend
  redAlertThreshold: 0 // Default threshold for red alert, will be set per asset
};

// Function to update alert configuration
function updateAlertConfig(newConfig) {
  alertConfig.yellowAlertPercentage = newConfig.yellowAlertPercentage || alertConfig.yellowAlertPercentage;
  alertConfig.yellowAlertDays = newConfig.yellowAlertDays || alertConfig.yellowAlertDays;
  alertConfig.redAlertThreshold = newConfig.redAlertThreshold || alertConfig.redAlertThreshold;
}

// Function to check for yellow alert condition
function checkForYellowAlert(sensorId) {
  // Calculate the average temperature trend over the last Y days
  const query = `SELECT AVG(temperature) as avgTemp FROM temperature_data 
                 WHERE sensorId = ? AND date >= date('now', '-${alertConfig.yellowAlertDays} day')`;
  const avgTemp = db.prepare(query).get(sensorId).avgTemp;
  const previousAvgTemp = db.prepare(query).get(sensorId, alertConfig.yellowAlertDays).avgTemp;

  // Check if there is an increase by X% in average temperature trend
  if (avgTemp >= previousAvgTemp * (1 + (alertConfig.yellowAlertPercentage / 100))) {
    return true; // Yellow alert condition met
  }
  return false; // No yellow alert
}

// Function to check for red alert condition
function checkForRedAlert(sensorId, currentTemperature) {
  // Fetch the temperature threshold for the sensor's asset
  const threshold = db.prepare('SELECT temperatureThreshold FROM assets WHERE id = (SELECT assetId FROM sensors WHERE id = ?)').get(sensorId).temperatureThreshold;
  updateAlertConfig({ redAlertThreshold: threshold });

  // Check if the current temperature meets or exceeds the threshold
  if (currentTemperature >= alertConfig.redAlertThreshold) {
    return true; // Red alert condition met
  }
  return false; // No red alert
}

// Function to send alerts and update UI
function sendAlerts(sensorId, currentTemperature) {
  const yellowAlert = checkForYellowAlert(sensorId);
  const redAlert = checkForRedAlert(sensorId, currentTemperature);

  if (redAlert) {
    ipcRenderer.send('alarm-triggered', { sensorId, level: 'red', temperature: currentTemperature });
  } else if (yellowAlert) {
    ipcRenderer.send('alarm-triggered', { sensorId, level: 'yellow', temperature: currentTemperature });
  } else {
    ipcRenderer.send('alarm-triggered', { sensorId, level: 'green', temperature: currentTemperature });
  }
}

// Export the functions for use in other modules
module.exports = {
  updateAlertConfig,
  checkForYellowAlert,
  checkForRedAlert,
  sendAlerts
};