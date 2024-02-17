// This script is responsible for creating and updating the sensor data chart
// using Chart.js in the ThermWatch application.

const Chart = require('chart.js');
const { ipcRenderer } = require('electron');

let temperatureChart; // This will hold our chart instance

// Function to create the temperature chart
function createTemperatureChart(sensorData) {
  const ctx = document.getElementById('temperature-chart').getContext('2d');
  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sensorData.map(data => data.time), // Assuming 'time' is a property of sensorData
      datasets: [{
        label: 'Temperature',
        data: sensorData.map(data => data.temperature), // Assuming 'temperature' is a property of sensorData
        backgroundColor: 'rgba(0, 123, 255, 0.2)', // Blue with opacity
        borderColor: 'rgba(0, 123, 255, 1)', // Solid blue
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value + '°'; // Append degree symbol to y-axis labels
            }
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              minute: 'h:mm a' // Format time as hours:minutes AM/PM
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return tooltipItem.yLabel + '°'; // Append degree symbol to tooltip labels
          }
        }
      }
    }
  });
}

// Function to update the temperature chart with new data
function updateTemperatureChart(newSensorData) {
  if (temperatureChart) {
    temperatureChart.data.labels = newSensorData.map(data => data.time);
    temperatureChart.data.datasets.forEach((dataset) => {
      dataset.data = newSensorData.map(data => data.temperature);
    });
    temperatureChart.update();
  }
}

// Listen for temperature updates from the main process
ipcRenderer.on('temperature-update', (event, sensorData) => {
  if (!temperatureChart) {
    createTemperatureChart(sensorData);
  } else {
    updateTemperatureChart(sensorData);
  }
});

// Function to toggle sensor data visibility on the chart
function toggleSensorData(sensorId, isVisible) {
  const dataset = temperatureChart.data.datasets.find(ds => ds.label === `Sensor ${sensorId}`);
  if (dataset) {
    dataset.hidden = !isVisible;
    temperatureChart.update();
  }
}

// Export functions for use in other modules
module.exports = {
  createTemperatureChart,
  updateTemperatureChart,
  toggleSensorData
};