// scripts/charts.js

const Chart = require('chart.js');
const { ipcRenderer } = require('electron');

// Function to create the real-time temperature chart
function createRealTimeTemperatureChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Time labels will be dynamically updated
      datasets: [] // Sensor data sets will be dynamically added
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              minute: 'h:mm a'
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Temperature'
          }
        }]
      }
    }
  });
}

// Function to create the polar trend plot
function createPolarTrendPlot(ctx) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [], // Sensor positions will be dynamically updated
      datasets: [{
        data: [], // Temperature data will be dynamically updated
        backgroundColor: [] // Colors based on alarm status will be dynamically updated
      }]
    },
    options: {
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
    }
  });
}

// Function to create the historic trend plot
function createHistoricTrendPlot(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Date labels will be dynamically updated
      datasets: [] // Sensor data sets will be dynamically added
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D'
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Temperature'
          }
        }]
      }
    }
  });
}

// Function to update the real-time temperature chart with new data
function updateRealTimeTemperatureChart(chart, sensorData) {
  chart.data.labels.push(sensorData.time);
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === sensorData.sensorName) {
      dataset.data.push(sensorData.temperature);
    }
  });
  chart.update();
}

// Function to update the polar trend plot with new data
function updatePolarTrendPlot(chart, sensorData) {
  chart.data.labels = sensorData.map(data => data.position);
  chart.data.datasets[0].data = sensorData.map(data => data.temperature);
  chart.data.datasets[0].backgroundColor = sensorData.map(data => data.statusColor);
  chart.update();
}

// Function to update the historic trend plot with new data
function updateHistoricTrendPlot(chart, sensorData) {
  chart.data.labels = sensorData.map(data => data.date);
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === sensorData.sensorName) {
      dataset.data = sensorData.map(data => data.temperature);
    }
  });
  chart.update();
}

// Listen for temperature updates from the main process
ipcRenderer.on('temperature-update', (event, sensorData) => {
  // Assuming 'realTimeTemperatureChart' is the chart instance for real-time data
  updateRealTimeTemperatureChart(realTimeTemperatureChart, sensorData);
  // Assuming 'polarTrendPlot' is the chart instance for the polar trend plot
  updatePolarTrendPlot(polarTrendPlot, sensorData);
  // Assuming 'historicTrendPlot' is the chart instance for the historic trend plot
  updateHistoricTrendPlot(historicTrendPlot, sensorData);
});

// Export the chart creation functions for use in other scripts
module.exports = {
  createRealTimeTemperatureChart,
  createPolarTrendPlot,
  createHistoricTrendPlot
};