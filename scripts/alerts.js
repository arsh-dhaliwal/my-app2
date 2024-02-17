const { ipcRenderer } = require('electron');
const { sendNotification, sendEmailAlert } = require('./notification.js');

const alertThresholds = {
  yellow: {
    percentageIncrease: 10, // Default value, configurable by user
    days: 3 // Default value, configurable by user
  },
  red: {
    temperatureThreshold: 100 // Default value, configurable by user
  }
};

function configureAlerts(config) {
  if (config.yellow) {
    alertThresholds.yellow.percentageIncrease = config.yellow.percentageIncrease;
    alertThresholds.yellow.days = config.yellow.days;
  }
  if (config.red) {
    alertThresholds.red.temperatureThreshold = config.red.temperatureThreshold;
  }
}

function checkForAlerts(sensorData) {
  const { sensorId, temperature, averageTemperatureLastDays } = sensorData;
  const status = {
    color: 'green',
    message: 'Everything is good'
  };

  // Check for red alert
  if (temperature >= alertThresholds.red.temperatureThreshold) {
    status.color = 'red';
    status.message = 'Immediate intervention required';
    sendAlerts(sensorId, status);
    return status;
  }

  // Check for yellow alert
  const percentageIncrease = (temperature - averageTemperatureLastDays) / averageTemperatureLastDays * 100;
  if (percentageIncrease >= alertThresholds.yellow.percentageIncrease) {
    status.color = 'yellow';
    status.message = 'Review required';
    sendAlerts(sensorId, status);
    return status;
  }

  // No alert
  return status;
}

function sendAlerts(sensorId, status) {
  // Send system notification
  sendNotification(`Sensor ${sensorId} Alert`, `Status: ${status.message}`);

  // Send email alert
  sendEmailAlert(`Sensor ${sensorId} Alert`, `Status: ${status.message}`);

  // Notify the main process to update the UI
  ipcRenderer.send('alert-triggered', { sensorId, status });
}

module.exports = {
  configureAlerts,
  checkForAlerts
};