// public/js/real-time-data-generation.js

const { ipcRenderer } = require('electron');
const betterSqlite3 = require('better-sqlite3');
const dbPath = 'db/thermwatch.tmdb';
const db = new betterSqlite3(dbPath);

// Function to generate random temperature data for a sensor
function generateRandomTemperature(sensor) {
  const variance = Math.random() * 10; // Random variance up to 10 degrees
  const baseTemperature = 50; // Base temperature for simulation purposes
  return baseTemperature + variance;
}

// Function to simulate real-time data generation and storage
function simulateSensorData() {
  const sensors = db.prepare('SELECT * FROM Sensor').all();
  sensors.forEach(sensor => {
    const temperature = generateRandomTemperature(sensor);
    const timestamp = new Date().toISOString();

    // Insert the generated temperature data into the database
    const insert = db.prepare('INSERT INTO TemperatureData (sensorId, temperature, timestamp) VALUES (?, ?, ?)');
    insert.run(sensor.id, temperature, timestamp);

    // Emit an event with the new temperature data
    ipcRenderer.send('temperature-update', {
      sensorId: sensor.id,
      temperature: temperature,
      timestamp: timestamp
    });
  });
}

// Function to start the real-time data generation process
function startRealTimeDataGeneration() {
  // Simulate data generation every 5 seconds
  setInterval(simulateSensorData, 5000);
}

// Export the function to start the real-time data generation
module.exports = {
  startRealTimeDataGeneration
};

// Call the function to start generating data when the app is loaded
startRealTimeDataGeneration();