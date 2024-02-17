// Utility functions for ThermWatch

const fs = require('fs');
const path = require('path');
const { dialog } = require('electron').remote;

// Path to the SQLite database file
const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');

// Function to save the current state of the database to the local machine
function saveDatabaseState() {
  dialog.showSaveDialog({
    title: 'Save Database',
    defaultPath: path.join(__dirname, 'thermwatch_backup.tmdb'),
    buttonLabel: 'Save',
    filters: [
      { name: 'ThermWatch Database', extensions: ['tmdb'] }
    ]
  }).then(file => {
    if (!file.canceled) {
      fs.copyFileSync(dbPath, file.filePath.toString());
    }
  }).catch(err => {
    console.error('Failed to save database:', err);
  });
}

// Function to import/open a database from the user's machine
function openDatabase() {
  dialog.showOpenDialog({
    title: 'Open Database',
    properties: ['openFile'],
    filters: [
      { name: 'ThermWatch Database', extensions: ['tmdb'] }
    ]
  }).then(file => {
    if (!file.canceled) {
      fs.copyFileSync(file.filePaths[0], dbPath);
      // Emit an event or call a function to refresh the application data
      // after importing a new database
      // e.g., eventEmitter.emit('database-imported');
    }
  }).catch(err => {
    console.error('Failed to open database:', err);
  });
}

// Function to convert temperature between Fahrenheit and Celsius
function convertTemperatureUnit(temperature, unit) {
  if (unit === 'F') {
    return (temperature - 32) * 5/9; // Convert to Celsius
  } else if (unit === 'C') {
    return (temperature * 9/5) + 32; // Convert to Fahrenheit
  } else {
    throw new Error('Invalid temperature unit');
  }
}

// Function to validate forms in settings
function validateForm(formData) {
  // Implement validation logic for form data
  // Return true if valid, false otherwise
  // This is a placeholder function and should be expanded based on actual form requirements
  return true;
}

// Function to handle form submissions
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  if (validateForm(formData)) {
    // Process the form data
    // e.g., save to database, update UI
  } else {
    // Show validation error messages
  }
}

// Function to display license and EULA information
function displayLicenseEULA() {
  const licensePath = path.join(__dirname, '..', 'LICENSE.txt');
  const eulaPath = path.join(__dirname, '..', 'EULA.txt');
  const licenseContent = fs.readFileSync(licensePath, 'utf8');
  const eulaContent = fs.readFileSync(eulaPath, 'utf8');
  
  // Display the content in a new window or a modal
  // This is a placeholder and should be implemented according to the UI requirements
  console.log('License:', licenseContent);
  console.log('EULA:', eulaContent);
}

// Export utility functions for use in other modules
module.exports = {
  saveDatabaseState,
  openDatabase,
  convertTemperatureUnit,
  validateForm,
  handleFormSubmit,
  displayLicenseEULA
};