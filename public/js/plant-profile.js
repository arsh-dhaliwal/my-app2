// plant-profile.js

const { ipcRenderer } = require('electron');
const db = require('../scripts/database.js');

// Function to handle form submission for plant profile
function submitPlantProfileForm(event) {
  event.preventDefault();
  const plantForm = document.getElementById('plant-profile-form');
  const plantData = new FormData(plantForm);
  const plantProfile = {
    plantName: plantData.get('plantName'),
    address: plantData.get('address'),
    city: plantData.get('city'),
    stateProvince: plantData.get('stateProvince'),
    country: plantData.get('country'),
    zipPostalCode: plantData.get('zipPostalCode'),
    phoneNumber: plantData.get('phoneNumber'),
    email: plantData.get('email')
  };

  // Validate the plant profile data
  if (validatePlantProfile(plantProfile)) {
    // Save the plant profile to the database
    db.savePlantProfile(plantProfile, (error) => {
      if (error) {
        ipcRenderer.send('show-message', 'Error', 'Failed to save plant profile.');
      } else {
        ipcRenderer.send('show-message', 'Success', 'Plant profile saved successfully.');
        // Clear the form after successful save
        plantForm.reset();
      }
    });
  } else {
    ipcRenderer.send('show-message', 'Error', 'Validation failed. Please check the input fields.');
  }
}

// Function to validate plant profile data
function validatePlantProfile(plantProfile) {
  // Add validation logic as needed
  return plantProfile.plantName && plantProfile.address && plantProfile.city &&
         plantProfile.stateProvince && plantProfile.country && plantProfile.zipPostalCode &&
         plantProfile.phoneNumber && plantProfile.email;
}

// Function to populate the plant profile form with existing data
function populatePlantProfileForm(plantId) {
  db.getPlantProfile(plantId, (error, plantProfile) => {
    if (error) {
      ipcRenderer.send('show-message', 'Error', 'Failed to retrieve plant profile.');
    } else {
      const plantForm = document.getElementById('plant-profile-form');
      plantForm.elements['plantName'].value = plantProfile.plantName;
      plantForm.elements['address'].value = plantProfile.address;
      plantForm.elements['city'].value = plantProfile.city;
      plantForm.elements['stateProvince'].value = plantProfile.stateProvince;
      plantForm.elements['country'].value = plantProfile.country;
      plantForm.elements['zipPostalCode'].value = plantProfile.zipPostalCode;
      plantForm.elements['phoneNumber'].value = plantProfile.phoneNumber;
      plantForm.elements['email'].value = plantProfile.email;
    }
  });
}

// Event listener for plant profile form submission
document.getElementById('plant-profile-form').addEventListener('submit', submitPlantProfileForm);

// Export functions for use in other modules if necessary
module.exports = {
  submitPlantProfileForm,
  validatePlantProfile,
  populatePlantProfileForm
};