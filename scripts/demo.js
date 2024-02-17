const { ipcRenderer } = require('electron');
const betterSqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');
const db = betterSqlite3(dbPath);

function generateMockData() {
  // Create mock company profile
  const insertCompany = db.prepare('INSERT INTO Company (companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertCompany.run('Demo Company', '123 Demo Street', 'Demoville', 'DemoState', 'DemoCountry', '12345', '123-456-7890', 'demo@company.com');

  // Create mock plant profile
  const insertPlant = db.prepare('INSERT INTO Plant (plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertPlant.run('Demo Plant', '456 Plant Road', 'Plantville', 'PlantState', 'PlantCountry', '67890', '098-765-4321', 'plant@demo.com');

  // Create mock asset profile
  const insertAsset = db.prepare('INSERT INTO Asset (assetName, plantId, capacity, rating, temperatureThreshold) VALUES (?, ?, ?, ?, ?)');
  insertAsset.run('Demo Asset', 1, '1000', 'A', 75);

  // Create mock sensor profile
  const insertSensor = db.prepare('INSERT INTO Sensor (sensorName, sensorFamily, sensorType, sensorVariant, assetId, position) VALUES (?, ?, ?, ?, ?, ?)');
  insertSensor.run('Demo Sensor', 'DemoFamily', 'DemoType', 'DemoVariant', 1, 0);

  // Generate mock sensor data
  const insertSensorData = db.prepare('INSERT INTO SensorData (sensorId, temperature, timestamp) VALUES (?, ?, ?)');
  const startDate = new Date('2018-01-01T00:00:00Z');
  const endDate = new Date();
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const mockTemperature = Math.random() * 100; // Random temperature between 0 and 100
    insertSensorData.run(1, mockTemperature, date.toISOString());
  }

  // Notify the renderer process that mock data has been created
  ipcRenderer.send('mock-data-created');
}

function enterDemoMode() {
  // Check if the database file exists
  if (!fs.existsSync(dbPath)) {
    console.error('Database file does not exist. Please initialize the database first.');
    return;
  }

  // Generate mock data
  generateMockData();

  // Notify the renderer process that the app is in demo mode
  ipcRenderer.send('demo-mode-entered');
}

module.exports = {
  enterDemoMode
};