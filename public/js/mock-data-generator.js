const { dbPath } = require('../scripts/database.js');
const sqlite3 = require('better-sqlite3');

const generateMockData = () => {
  const db = new sqlite3(dbPath);

  // Create mock company profile
  const insertCompany = db.prepare('INSERT INTO Company (companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertCompany.run('Demo Company', '123 Demo Street', 'Demoville', 'DemoState', 'DemoCountry', '12345', '123-456-7890', 'demo@company.com');

  // Create mock plant profile
  const insertPlant = db.prepare('INSERT INTO Plant (plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertPlant.run('Demo Plant', '456 Plant Road', 'Plantville', 'PlantState', 'PlantCountry', '67890', '098-765-4321', 'plant@demo.com');

  // Get the last inserted plant ID to link assets
  const lastPlantId = db.prepare('SELECT last_insert_rowid() AS id').get().id;

  // Create mock asset profile
  const insertAsset = db.prepare('INSERT INTO Asset (assetName, plantId, capacity, rating, temperatureThreshold) VALUES (?, ?, ?, ?, ?)');
  insertAsset.run('Demo Asset', lastPlantId, '1000', 'A', '75');

  // Get the last inserted asset ID to link sensors
  const lastAssetId = db.prepare('SELECT last_insert_rowid() AS id').get().id;

  // Create mock sensor profile
  const insertSensor = db.prepare('INSERT INTO Sensor (sensorName, sensorFamily, sensorType, sensorVariant, assetId, position) VALUES (?, ?, ?, ?, ?, ?)');
  insertSensor.run('Demo Sensor', 'Thermo', 'Temperature', 'T100', lastAssetId, '1');

  // Generate mock sensor data including historic data going back to 2018
  const insertSensorData = db.prepare('INSERT INTO SensorData (sensorId, temperature, timestamp) VALUES (?, ?, ?)');
  const startDate = new Date('2018-01-01');
  const endDate = new Date();
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const mockTemperature = Math.random() * 100; // Random temperature between 0 and 100
    insertSensorData.run(lastAssetId, mockTemperature, date.toISOString());
  }

  // Generate mock real-time data
  setInterval(() => {
    const mockTemperature = Math.random() * 100; // Random temperature between 0 and 100
    insertSensorData.run(lastAssetId, mockTemperature, new Date().toISOString());
  }, 1000); // Every second

  db.close();
};

module.exports = {
  generateMockData
};