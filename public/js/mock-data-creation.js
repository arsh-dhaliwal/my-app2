const { dbPath } = require('../scripts/database.js');
const sqlite3 = require('better-sqlite3');
const moment = require('moment');

function generateMockData() {
  const db = new sqlite3(dbPath);
  const startDate = moment('2018-01-01');
  const endDate = moment();
  const companies = [
    { companyName: 'ThermoCo', address: '123 Heat St', city: 'Burnsville', stateProvince: 'CA', country: 'USA', zipPostalCode: '12345', phoneNumber: '555-1234', email: 'contact@thermoco.com' }
  ];
  const plants = [
    { plantName: 'Main Plant', address: '456 Furnace Ave', city: 'Burnsville', stateProvince: 'CA', country: 'USA', zipPostalCode: '12345', phoneNumber: '555-5678', email: 'plant@thermoco.com' }
  ];
  const assets = [
    { assetName: 'Reactor 1', plantId: 1, capacity: '500L', rating: 'A', temperatureThreshold: '100' }
  ];
  const sensors = [
    { sensorName: 'TempSensor1', sensorFamily: 'ThermoMax', sensorType: 'Type K', sensorVariant: 'K-500', assetId: 1, position: 0 }
  ];

  // Insert mock data into the database
  db.transaction(() => {
    companies.forEach(company => {
      db.prepare('INSERT INTO Company (companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(Object.values(company));
    });
    plants.forEach(plant => {
      db.prepare('INSERT INTO Plant (plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(Object.values(plant));
    });
    assets.forEach(asset => {
      db.prepare('INSERT INTO Asset (assetName, plantId, capacity, rating, temperatureThreshold) VALUES (?, ?, ?, ?, ?)').run(Object.values(asset));
    });
    sensors.forEach(sensor => {
      db.prepare('INSERT INTO Sensor (sensorName, sensorFamily, sensorType, sensorVariant, assetId, position) VALUES (?, ?, ?, ?, ?, ?)').run(Object.values(sensor));
    });

    // Generate historical temperature data
    for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      sensors.forEach(sensor => {
        const maxTemp = Math.random() * 100;
        const minTemp = Math.random() * 50;
        const avgTemp = (maxTemp + minTemp) / 2;
        db.prepare('INSERT INTO TemperatureData (sensorId, date, maxTemperature, minTemperature, avgTemperature) VALUES (?, ?, ?, ?, ?)').run(sensor.sensorName, m.format('YYYY-MM-DD'), maxTemp, minTemp, avgTemp);
      });
    }
  })();
}

module.exports = {
  generateMockData
};