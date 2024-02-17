// asset-profile.js

const { ipcRenderer } = require('electron');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db', 'thermwatch.tmdb');
const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3(dbPath);

// Function to add a new asset to the database
function addAsset(assetData) {
  const insert = db.prepare(`INSERT INTO Asset (assetName, plantId, capacity, rating, temperatureThreshold) VALUES (?, ?, ?, ?, ?)`);
  insert.run(assetData.assetName, assetData.plantId, assetData.capacity, assetData.rating, assetData.temperatureThreshold);
}

// Function to update an existing asset in the database
function updateAsset(assetData) {
  const update = db.prepare(`UPDATE Asset SET assetName = ?, plantId = ?, capacity = ?, rating = ?, temperatureThreshold = ? WHERE id = ?`);
  update.run(assetData.assetName, assetData.plantId, assetData.capacity, assetData.rating, assetData.temperatureThreshold, assetData.id);
}

// Function to delete an asset from the database
function deleteAsset(assetId) {
  const del = db.prepare(`DELETE FROM Asset WHERE id = ?`);
  del.run(assetId);
}

// Function to get all assets from the database
function getAllAssets() {
  const selectAll = db.prepare(`SELECT * FROM Asset`);
  return selectAll.all();
}

// Function to get a single asset by its ID
function getAssetById(assetId) {
  const select = db.prepare(`SELECT * FROM Asset WHERE id = ?`);
  return select.get(assetId);
}

// Function to populate the asset form with data
function populateAssetForm(assetId) {
  const asset = getAssetById(assetId);
  if (asset) {
    document.getElementById('asset-name').value = asset.assetName;
    document.getElementById('plant-id').value = asset.plantId;
    document.getElementById('capacity').value = asset.capacity;
    document.getElementById('rating').value = asset.rating;
    document.getElementById('temperature-threshold').value = asset.temperatureThreshold;
  }
}

// Event listener for form submission
document.getElementById('asset-profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const assetData = {
    assetName: document.getElementById('asset-name').value,
    plantId: document.getElementById('plant-id').value,
    capacity: document.getElementById('capacity').value,
    rating: document.getElementById('rating').value,
    temperatureThreshold: document.getElementById('temperature-threshold').value
  };
  
  if (assetData.id) {
    updateAsset(assetData);
  } else {
    addAsset(assetData);
  }
  
  // Notify the main process that the asset profile has been updated
  ipcRenderer.send('asset-profile-updated');
});

// Event listener for delete button
document.getElementById('delete-asset').addEventListener('click', () => {
  const assetId = document.getElementById('asset-id').value;
  if (assetId) {
    deleteAsset(assetId);
    // Notify the main process that the asset has been deleted
    ipcRenderer.send('asset-deleted');
  }
});

// Function to initialize the asset profile form
function initAssetProfile() {
  // Populate the plant selection dropdown
  const plants = getAllPlants(); // Assuming getAllPlants() is defined in plant-profile.js
  const plantSelect = document.getElementById('plant-id');
  plants.forEach(plant => {
    const option = document.createElement('option');
    option.value = plant.id;
    option.textContent = plant.plantName;
    plantSelect.appendChild(option);
  });
}

// Call the initialization function when the script loads
initAssetProfile();