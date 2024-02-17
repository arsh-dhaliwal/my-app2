// public/js/demo-mode.js

const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const betterSqlite3 = require('better-sqlite3');

// Path to the database file
const dbPath = path.join(__dirname, '..', '..', 'db', 'thermwatch.tmdb');

// Function to create mock data for demo mode
function createDemoData() {
  const db = new betterSqlite3(dbPath);

  // Create mock company profile
  const insertCompany = db.prepare('INSERT INTO Company (companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertCompany.run('Demo Company', '123 Demo Street', 'Demo City', 'Demo State', 'Demo Country', '12345', '123-456-7890', 'demo@company.com');

  // Create mock plant profile
  const insertPlant = db.prepare('INSERT INTO Plant (plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertPlant.run('Demo Plant', '456 Plant Road', 'Plant City', 'Plant State', 'Plant Country', '67890', '098-765-4321', 'plant@demo.com');

  // Create mock asset profile
  const insertAsset = db.prepare('INSERT INTO Asset (assetName, plantId, capacity, rating, temperatureThreshold) VALUES (?, ?, ?, ?, ?)');
  insertAsset.run('Demo Asset', 1, '1000', 'A', 75);

  // Create mock sensor profile
  const insertSensor = db.prepare('INSERT INTO Sensor (sensorName, sensorFamily, sensorType, sensorVariant, assetId, position) VALUES (?, ?, ?, ?, ?, ?)');
  insertSensor.run('Demo Sensor', 'Thermo', 'Temperature', 'T100', 1, 0);

  // Generate mock sensor data including historic data going back to 2018
  const insertSensorData = db.prepare('INSERT INTO SensorData (sensorId, temperature, timestamp) VALUES (?, ?, ?)');
  const startDate = new Date('2018-01-01T00:00:00Z');
  const endDate = new Date();
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const mockTemperature = Math.random() * 100; // Random temperature for demo
    insertSensorData.run(1, mockTemperature, date.toISOString());
  }

  // Generate mock real-time data
  setInterval(() => {
    const mockTemperature = Math.random() * 100; // Random temperature for demo
    insertSensorData.run(1, mockTemperature, new Date().toISOString());
    ipcRenderer.send('temperature-update', { sensorId: 1, temperature: mockTemperature });
  }, 5000); // Update every 5 seconds

  db.close();
}

// Function to activate demo mode
function activateDemoMode() {
  // Check if the demo database already exists
  if (fs.existsSync(dbPath)) {
    console.log('Demo database already exists.');
    return;
  }

  // Create the database and tables if they don't exist
  const db = new betterSqlite3(dbPath);
  const createTablesScript = fs.readFileSync(path.join(__dirname, '..', '..', 'db', 'migrations', 'initial_setup.sql'), 'utf8');
  db.exec(createTablesScript);
  db.close();

  // Create the mock data
  createDemoData();

  console.log('Demo mode activated with mock data.');
}

// Export the activateDemoMode function to be used elsewhere in the application
module.exports = {
  activateDemoMode
};