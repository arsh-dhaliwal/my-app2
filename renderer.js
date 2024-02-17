// Import necessary modules and scripts
const { ipcRenderer } = require('electron');
const Chart = require('chart.js');
const { toggleTheme, updateChart, updatePolarPlot, updateHistoricTrend, showSettings, showDemoMode, convertTemperatureUnit, displayLicenseEULA } = require('./public/js/utils');
const { createSensorCard } = require('./public/js/sensor-card');
const { sendNotification, sendEmailAlert } = require('./public/js/notification');

// DOM elements
const temperatureChartCanvas = document.getElementById('temperature-chart');
const polarTrendPlotCanvas = document.getElementById('polar-trend-plot');
const historicTrendPlotCanvas = document.getElementById('historic-trend-plot');
const sensorCardsContainer = document.getElementById('sensor-cards-container');
const themeToggle = document.getElementById('theme-toggle');

// Initialize temperature chart
let temperatureChart = new Chart(temperatureChartCanvas, {
  type: 'line',
  data: {
    labels: [], // Time labels will be dynamically updated
    datasets: [] // Sensor data sets will be dynamically updated
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Initialize polar trend plot
let polarTrendPlot = new Chart(polarTrendPlotCanvas, {
  type: 'polarArea',
  data: {
    labels: [], // Sensor positions will be dynamically updated
    datasets: [{
      data: [], // Temperature data will be dynamically updated
      backgroundColor: [] // Colors based on alarm status
    }]
  }
});

// Initialize historic trend plot
let historicTrendPlot = new Chart(historicTrendPlotCanvas, {
  type: 'line',
  data: {
    labels: [], // Date labels will be dynamically updated
    datasets: [] // Sensor data sets will be dynamically updated
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Event listeners
themeToggle.addEventListener('change', toggleTheme);

// IPC event listeners
ipcRenderer.on('temperature-update', (event, sensorData) => {
  updateChart(temperatureChart, sensorData);
  createSensorCard(sensorData, sensorCardsContainer);
});

ipcRenderer.on('alarm-triggered', (event, alarmData) => {
  sendNotification(alarmData);
  sendEmailAlert(alarmData);
  updatePolarPlot(polarTrendPlot, alarmData);
  updateHistoricTrend(historicTrendPlot, alarmData);
});

ipcRenderer.on('database-imported', (event, importedData) => {
  // Handle imported database data
});

ipcRenderer.on('database-exported', (event) => {
  // Handle successful database export
});

// Functions to handle UI interactions
document.getElementById('settings-button').addEventListener('click', () => {
  showSettings();
});

document.getElementById('demo-mode-button').addEventListener('click', () => {
  showDemoMode();
});

document.getElementById('license-eula-button').addEventListener('click', () => {
  displayLicenseEULA();
});

document.getElementById('temperature-unit-toggle').addEventListener('change', (event) => {
  convertTemperatureUnit(event.target.value, temperatureChart, polarTrendPlot, historicTrendPlot);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Perform startup tasks
  showStartupConfigPopup();
});