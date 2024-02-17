// public/js/polar-trend-plot-historic.js

const Chart = require('chart.js');
const { dbPath, temperatureUnit } = require('../js/shared-dependencies.js');

// Function to create the polar trend plot for historical data
function createHistoricPolarTrendPlot(dateSelected) {
  const db = require('better-sqlite3')(dbPath, { verbose: console.log });

  // Query to get the historical temperature data for the selected date
  const sql = `
    SELECT s.position, t.temperature, t.time
    FROM temperatures t
    INNER JOIN sensors s ON t.sensor_id = s.id
    WHERE DATE(t.time) = ?
    ORDER BY s.position ASC
  `;
  const temperatures = db.prepare(sql).all(dateSelected);

  // Process the data for the polar chart
  const data = {
    datasets: [{
      data: [],
      backgroundColor: [],
      label: 'Historic Temperature Data'
    }],
    labels: []
  };

  temperatures.forEach((temp) => {
    data.datasets[0].data.push(convertTemperatureUnit(temp.temperature));
    data.datasets[0].backgroundColor.push(getTemperatureColor(temp.temperature));
    data.labels.push(`Position ${temp.position}`);
  });

  // Destroy the previous chart instance if it exists
  if (window.historicPolarChart) {
    window.historicPolarChart.destroy();
  }

  // Create the polar chart
  const ctx = document.getElementById('polar-trend-plot').getContext('2d');
  window.historicPolarChart = new Chart(ctx, {
    data: data,
    type: 'polarArea',
    options: {
      scale: {
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return value + (temperatureUnit === 'F' ? '°F' : '°C');
          }
        }
      }
    }
  });

  db.close();
}

// Function to convert temperature based on the selected unit
function convertTemperatureUnit(temperature) {
  return temperatureUnit === 'F' ? (temperature * 9/5) + 32 : temperature;
}

// Function to get the color based on the temperature value
function getTemperatureColor(temperature) {
  if (temperature < 20) {
    return 'blue';
  } else if (temperature >= 20 && temperature < 50) {
    return 'green';
  } else if (temperature >= 50 && temperature < 80) {
    return 'yellow';
  } else {
    return 'red';
  }
}

// Event listener for date selection change
document.getElementById('date-selection').addEventListener('change', (event) => {
  const selectedDate = event.target.value;
  createHistoricPolarTrendPlot(selectedDate);
});

// Initial call to display the chart with the default date
createHistoricPolarTrendPlot(new Date().toISOString().split('T')[0]);