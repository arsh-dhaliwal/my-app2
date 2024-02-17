const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');

// Function to save the current state of the database to a local machine
function saveDatabaseState() {
  dialog.showSaveDialog({
    title: 'Save Database',
    defaultPath: 'thermwatch_backup.tmdb',
    filters: [
      { name: 'ThermWatch Database', extensions: ['tmdb'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      fs.copyFileSync(dbPath, result.filePath);
      alert('Database saved successfully!');
    }
  }).catch(err => {
    console.error('Failed to save the database:', err);
    alert('Error saving database.');
  });
}

// Function to import/open a database from the user's machine
function openDatabase() {
  dialog.showOpenDialog({
    title: 'Open Database',
    filters: [
      { name: 'ThermWatch Database', extensions: ['tmdb'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const selectedPath = result.filePaths[0];
      try {
        const db = new sqlite3(selectedPath);
        // Perform any necessary validation or setup after opening the new database
        // For example, check if all required tables exist
        // This is a placeholder for actual validation logic
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        if (tables.length > 0) {
          // Assume the database is valid for the sake of this example
          fs.copyFileSync(selectedPath, dbPath);
          alert('Database opened successfully!');
        } else {
          alert('Invalid database file.');
        }
      } catch (err) {
        console.error('Failed to open the database:', err);
        alert('Error opening database.');
      }
    }
  }).catch(err => {
    console.error('Failed to open a database:', err);
    alert('Error opening database dialog.');
  });
}

module.exports = {
  saveDatabaseState,
  openDatabase
};