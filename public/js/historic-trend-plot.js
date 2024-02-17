// public/js/historic-trend-plot.js

const Chart = require('chart.js');
const { dbPath, temperatureUnit } = require('../scripts/database.js');

// Function to fetch historic data from the database
function fetchHistoricData(sensorId, startDate, endDate) {
  const sqlite3 = require('better-sqlite3');
  const db = new sqlite3(dbPath);
  let query = `SELECT * FROM TemperatureData WHERE sensorId = ? AND date BETWEEN ? AND ?`;
  let params = [sensorId, startDate, endDate];
  let data = db.prepare(query).all(params);
  db.close();
  return data;
}

// Function to prepare the dataset for the historic trend plot
function prepareHistoricDataset(data) {
  return data.map(entry => {
    return {
      x: new Date(entry.date),
      y: temperatureUnit === 'Fahrenheit' ? convertToFahrenheit(entry.temperature) : entry.temperature
    };
  });
}

// Function to convert Celsius to Fahrenheit
function convertToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to create the historic trend plot
function createHistoricTrendPlot(sensorId, startDate, endDate) {
  const ctx = document.getElementById('historic-trend-plot').getContext('2d');
  const historicData = fetchHistoricData(sensorId, startDate, endDate);
  const dataset = prepareHistoricDataset(historicData);

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Temperature',
        data: dataset,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: `Temperature (${temperatureUnit})`
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Event listener for date range selection changes
document.getElementById('date-range-selector').addEventListener('change', (event) => {
  const sensorId = document.getElementById('sensor-selector').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  createHistoricTrendPlot(sensorId, startDate, endDate);
});

// Initial plot creation
document.addEventListener('DOMContentLoaded', () => {
  const sensorId = document.getElementById('sensor-selector').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  createHistoricTrendPlot(sensorId, startDate, endDate);
});

// Export the functions for use in other modules
module.exports = {
  fetchHistoricData,
  prepareHistoricDataset,
  createHistoricTrendPlot
};