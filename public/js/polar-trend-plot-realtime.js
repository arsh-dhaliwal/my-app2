// This script is responsible for creating and updating the real-time polar trend plot
// for the ThermWatch application. It uses Chart.js to render the polar area chart
// and updates the chart as new temperature data comes in.

const Chart = require('chart.js');
let polarTrendChart;

// Function to initialize the polar trend plot
function initializePolarTrendPlot() {
  const ctx = document.getElementById('polar-trend-plot').getContext('2d');
  polarTrendChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [], // Sensor positions will be dynamically added
      datasets: [{
        label: 'Temperature',
        data: [], // Temperature data will be dynamically added
        backgroundColor: [] // Colors will be dynamically updated based on alarm status
      }]
    },
    options: {
      responsive: true,
      scale: {
        ticks: {
          beginAtZero: true
        }
      },
      animation: {
        duration: 0 // Disable initial animation
      }
    }
  });
}

// Function to update the polar trend plot with new data
function updatePolarTrendPlot(sensorData) {
  if (!polarTrendChart) {
    console.error('Polar trend plot has not been initialized.');
    return;
  }

  // Clear existing data
  polarTrendChart.data.labels = [];
  polarTrendChart.data.datasets[0].data = [];
  polarTrendChart.data.datasets[0].backgroundColor = [];

  // Populate chart with new data
  sensorData.forEach(sensor => {
    polarTrendChart.data.labels.push(sensor.position);
    polarTrendChart.data.datasets[0].data.push(sensor.temperature);
    polarTrendChart.data.datasets[0].backgroundColor.push(getAlarmStatusColor(sensor.status));
  });

  // Update the chart
  polarTrendChart.update();
}

// Function to determine the color of the chart segment based on alarm status
function getAlarmStatusColor(status) {
  switch (status) {
    case 'good':
      return 'green';
    case 'attention':
      return 'yellow';
    case 'intervention':
      return 'red';
    default:
      return 'grey'; // Default color for unknown status
  }
}

// Event listener for temperature updates
window.addEventListener('temperature-update', (event) => {
  const sensorData = event.detail;
  updatePolarTrendPlot(sensorData);
});

// Initialize the polar trend plot when the document is ready
document.addEventListener('DOMContentLoaded', initializePolarTrendPlot);