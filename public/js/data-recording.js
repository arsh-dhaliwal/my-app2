const path = require('path');
const { ipcRenderer } = require('electron');
const betterSqlite3 = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');
const db = betterSqlite3(dbPath);

// Function to record temperature data into the database
function recordTemperatureData(sensorId, temperature) {
  const insertStmt = db.prepare('INSERT INTO temperature_data (sensor_id, temperature, timestamp) VALUES (?, ?, ?)');
  insertStmt.run(sensorId, temperature, new Date().toISOString());
}

// Function to calculate daily maximum, minimum, average temperature and alarms
function calculateDailyTemperature() {
  const sensors = db.prepare('SELECT id FROM sensors').all();
  sensors.forEach(sensor => {
    const sensorId = sensor.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dataStmt = db.prepare('SELECT temperature FROM temperature_data WHERE sensor_id = ? AND timestamp BETWEEN ? AND ?');
    const temperatures = dataStmt.all(sensorId, today.toISOString(), tomorrow.toISOString()).map(row => row.temperature);

    if (temperatures.length > 0) {
      const maxTemperature = Math.max(...temperatures);
      const minTemperature = Math.min(...temperatures);
      const avgTemperature = temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length;

      const insertStmt = db.prepare('INSERT INTO daily_temperature (sensor_id, date, max_temperature, min_temperature, avg_temperature) VALUES (?, ?, ?, ?, ?)');
      insertStmt.run(sensorId, today.toISOString(), maxTemperature, minTemperature, avgTemperature);

      checkAndTriggerAlarms(sensorId, maxTemperature, avgTemperature);
    }
  });
}

// Function to check and trigger alarms based on temperature thresholds
function checkAndTriggerAlarms(sensorId, maxTemperature, avgTemperature) {
  const sensor = db.prepare('SELECT * FROM sensors WHERE id = ?').get(sensorId);
  const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(sensor.asset_id);
  const threshold = asset.temperature_threshold;

  let status = 'green'; // Default status
  if (avgTemperature > threshold) {
    status = 'red';
    ipcRenderer.send('alarm-triggered', { sensorId, status, temperature: avgTemperature });
  } else {
    // Check for yellow status based on configurable percentage increase and days
    // This is a placeholder for the actual implementation
    const percentageIncrease = 10; // This should be configurable
    const daysToCheck = 7; // This should be configurable
    // ... logic to determine if the yellow status should be triggered
  }

  const insertStmt = db.prepare('INSERT INTO alarms (sensor_id, status, timestamp) VALUES (?, ?, ?)');
  insertStmt.run(sensorId, status, new Date().toISOString());
}

module.exports = {
  recordTemperatureData,
  calculateDailyTemperature
};