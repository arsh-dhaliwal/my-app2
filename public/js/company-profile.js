// public/js/company-profile.js

const { ipcRenderer } = require('electron');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'db', 'thermwatch.tmdb');
const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3(dbPath);

// Function to save company profile to the database
function saveCompanyProfile(companyData) {
  const { companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email } = companyData;
  try {
    const stmt = db.prepare('INSERT INTO Company (companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email);
    return info.changes === 1;
  } catch (error) {
    console.error('Error saving company profile:', error);
    return false;
  }
}

// Function to update company profile in the database
function updateCompanyProfile(companyData) {
  const { companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email } = companyData;
  try {
    const stmt = db.prepare('UPDATE Company SET address = ?, city = ?, stateProvince = ?, country = ?, zipPostalCode = ?, phoneNumber = ?, email = ? WHERE companyName = ?');
    const info = stmt.run(address, city, stateProvince, country, zipPostalCode, phoneNumber, email, companyName);
    return info.changes === 1;
  } catch (error) {
    console.error('Error updating company profile:', error);
    return false;
  }
}

// Function to load company profile from the database
function loadCompanyProfile() {
  try {
    const stmt = db.prepare('SELECT * FROM Company');
    const companyProfile = stmt.get();
    return companyProfile;
  } catch (error) {
    console.error('Error loading company profile:', error);
    return null;
  }
}

// Function to handle form submission for company profile
function handleCompanyProfileFormSubmit(event) {
  event.preventDefault();
  const companyProfileForm = document.getElementById('company-profile-form');
  const formData = new FormData(companyProfileForm);
  const companyData = {
    companyName: formData.get('companyName'),
    address: formData.get('address'),
    city: formData.get('city'),
    stateProvince: formData.get('stateProvince'),
    country: formData.get('country'),
    zipPostalCode: formData.get('zipPostalCode'),
    phoneNumber: formData.get('phoneNumber'),
    email: formData.get('email')
  };

  // Check if we are updating or creating a new company profile
  const existingProfile = loadCompanyProfile();
  if (existingProfile) {
    updateCompanyProfile(companyData);
  } else {
    saveCompanyProfile(companyData);
  }

  // Notify the main process that the company profile has been updated
  ipcRenderer.send('company-profile-updated');
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
  const companyProfileForm = document.getElementById('company-profile-form');
  if (companyProfileForm) {
    companyProfileForm.addEventListener('submit', handleCompanyProfileFormSubmit);
  }

  // Load existing company profile data into the form if it exists
  const existingProfile = loadCompanyProfile();
  if (existingProfile) {
    for (const [key, value] of Object.entries(existingProfile)) {
      const input = companyProfileForm.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = value;
      }
    }
  }
});