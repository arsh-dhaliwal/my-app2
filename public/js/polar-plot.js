// This script is responsible for creating and updating the Polar Trend Plot
// in the ThermWatch application. It uses Chart.js to render the polar area chart
// which displays daily maximum, minimum, or average temperature for each sensor.

const Chart = require('chart.js');

// Function to create the polar trend plot
function createPolarTrendPlot(sensorData, temperatureUnit) {
  const ctx = document.getElementById('polar-trend-plot').getContext('2d');
  const labels = sensorData.map(sensor => `Sensor ${sensor.position}`);
  const data = sensorData.map(sensor => {
    return temperatureUnit === 'Fahrenheit' ? convertToFahrenheit(sensor.temperature) : sensor.temperature;
  });

  const polarTrendPlot = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature',
        data: data,
        backgroundColor: sensorData.map(sensor => getTemperatureColor(sensor.temperature, sensor.threshold)),
      }]
    },
    options: {
      scale: {
        ticks: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Polar Trend Plot'
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });

  return polarTrendPlot;
}

// Function to update the polar trend plot with new data
function updatePolarTrendPlot(chart, sensorData, temperatureUnit) {
  chart.data.labels = sensorData.map(sensor => `Sensor ${sensor.position}`);
  chart.data.datasets.forEach((dataset) => {
    dataset.data = sensorData.map(sensor => {
      return temperatureUnit === 'Fahrenheit' ? convertToFahrenheit(sensor.temperature) : sensor.temperature;
    });
    dataset.backgroundColor = sensorData.map(sensor => getTemperatureColor(sensor.temperature, sensor.threshold));
  });
  chart.update();
}

// Function to convert Celsius to Fahrenheit
function convertToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to determine the color of the temperature based on the threshold
function getTemperatureColor(temperature, threshold) {
  if (temperature >= threshold) {
    return 'red'; // Temperature exceeds the threshold
  } else {
    return 'blue'; // Normal temperature
  }
}

// Export the functions to be used in other parts of the application
module.exports = {
  createPolarTrendPlot,
  updatePolarTrendPlot
};