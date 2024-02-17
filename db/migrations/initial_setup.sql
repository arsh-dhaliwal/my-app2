-- Initialize the ThermWatch database schema

-- Create Company Profile Table
CREATE TABLE IF NOT EXISTS Company (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    stateProvince TEXT NOT NULL,
    country TEXT NOT NULL,
    zipPostalCode TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT NOT NULL
);

-- Create Plant Profile Table
CREATE TABLE IF NOT EXISTS Plant (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plantName TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    stateProvince TEXT NOT NULL,
    country TEXT NOT NULL,
    zipPostalCode TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT NOT NULL,
    companyId INTEGER,
    FOREIGN KEY (companyId) REFERENCES Company(id)
);

-- Create Asset Profile Table
CREATE TABLE IF NOT EXISTS Asset (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetName TEXT NOT NULL,
    plantId INTEGER NOT NULL,
    capacity REAL,
    rating REAL,
    temperatureThreshold REAL,
    FOREIGN KEY (plantId) REFERENCES Plant(id)
);

-- Create Sensor Profile Table
CREATE TABLE IF NOT EXISTS Sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensorName TEXT NOT NULL,
    sensorFamily TEXT NOT NULL,
    sensorType TEXT NOT NULL,
    sensorVariant TEXT NOT NULL,
    assetId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (assetId) REFERENCES Asset(id)
);

-- Create Temperature Data Table
CREATE TABLE IF NOT EXISTS TemperatureData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensorId INTEGER NOT NULL,
    temperature REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensorId) REFERENCES Sensor(id)
);

-- Create Alerts Table
CREATE TABLE IF NOT EXISTS Alert (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensorId INTEGER NOT NULL,
    message TEXT NOT NULL,
    alertType TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensorId) REFERENCES Sensor(id)
);