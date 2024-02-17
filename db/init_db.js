const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'thermwatch.tmdb');

// Check if the database file already exists
if (!fs.existsSync(dbPath)) {
  // Create a new database instance and open the file
  const db = new Database(dbPath);

  // Run a transaction to create tables
  db.transaction(() => {
    // Create Company Profile table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS Company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        companyName TEXT,
        address TEXT,
        city TEXT,
        stateProvince TEXT,
        country TEXT,
        zipPostalCode TEXT,
        phoneNumber TEXT,
        email TEXT
      )
    `).run();

    // Create Plant Profile table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS Plant (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plantName TEXT,
        address TEXT,
        city TEXT,
        stateProvince TEXT,
        country TEXT,
        zipPostalCode TEXT,
        phoneNumber TEXT,
        email TEXT,
        companyId INTEGER,
        FOREIGN KEY(companyId) REFERENCES Company(id)
      )
    `).run();

    // Create Asset Profile table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS Asset (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assetName TEXT,
        plantId INTEGER,
        capacity REAL,
        rating REAL,
        temperatureThreshold REAL,
        FOREIGN KEY(plantId) REFERENCES Plant(id)
      )
    `).run();

    // Create Sensor Profile table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS Sensor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensorName TEXT,
        sensorFamily TEXT,
        sensorType TEXT,
        sensorVariant TEXT,
        assetId INTEGER,
        position INTEGER,
        FOREIGN KEY(assetId) REFERENCES Asset(id)
      )
    `).run();

    // Create Temperature Data table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS TemperatureData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensorId INTEGER,
        timestamp DATETIME,
        temperature REAL,
        FOREIGN KEY(sensorId) REFERENCES Sensor(id)
      )
    `).run();

    // Create Alarms table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS Alarms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensorId INTEGER,
        timestamp DATETIME,
        status TEXT,
        FOREIGN KEY(sensorId) REFERENCES Sensor(id)
      )
    `).run();
  })();
  
  console.log('Database initialized successfully.');
} else {
  console.log('Database file already exists.');
}