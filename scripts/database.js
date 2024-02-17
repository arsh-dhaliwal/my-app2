const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');

// Initialize a new database
function initializeDatabase() {
  const dbExists = fs.existsSync(dbPath);
  if (!dbExists) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new Database(dbPath, { verbose: console.log });

  // Create tables if they don't exist
  db.exec(`
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
    );

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
      FOREIGN KEY (companyId) REFERENCES Company(id)
    );

    CREATE TABLE IF NOT EXISTS Asset (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assetName TEXT,
      plantId INTEGER,
      capacity REAL,
      rating REAL,
      temperatureThreshold REAL,
      FOREIGN KEY (plantId) REFERENCES Plant(id)
    );

    CREATE TABLE IF NOT EXISTS Sensor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorName TEXT,
      sensorFamily TEXT,
      sensorType TEXT,
      sensorVariant TEXT,
      assetId INTEGER,
      position INTEGER,
      FOREIGN KEY (assetId) REFERENCES Asset(id)
    );

    CREATE TABLE IF NOT EXISTS TemperatureData (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorId INTEGER,
      temperature REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sensorId) REFERENCES Sensor(id)
    );
  `);

  return db;
}

// Save the current state of the database to a local file
function saveDatabaseState() {
  const source = fs.readFileSync(dbPath);
  const destinationPath = path.join(__dirname, '..', 'db', `backup-${Date.now()}.tmdb`);
  fs.writeFileSync(destinationPath, source);
  console.log('Database state saved to', destinationPath);
}

// Import a database from the user's machine
function importDatabase(filePath) {
  const source = fs.readFileSync(filePath);
  fs.writeFileSync(dbPath, source);
  console.log('Database imported from', filePath);
}

// Export the database to the user's machine
function exportDatabase(destinationPath) {
  const source = fs.readFileSync(dbPath);
  fs.writeFileSync(destinationPath, source);
  console.log('Database exported to', destinationPath);
}

module.exports = {
  initializeDatabase,
  saveDatabaseState,
  importDatabase,
  exportDatabase
};