// validation.js - Validation functions for ThermWatch app forms and configurations

// Validates company profile form data
function validateCompanyProfile(companyData) {
  const { companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email } = companyData;
  let errors = [];

  if (!companyName) errors.push('Company name is required.');
  if (!address) errors.push('Address is required.');
  if (!city) errors.push('City is required.');
  if (!stateProvince) errors.push('State/Province is required.');
  if (!country) errors.push('Country is required.');
  if (!zipPostalCode) errors.push('Zip/Postal Code is required.');
  if (!phoneNumber) errors.push('Phone number is required.');
  if (!email || !validateEmail(email)) errors.push('A valid email is required.');

  return errors;
}

// Validates plant profile form data
function validatePlantProfile(plantData) {
  const { plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email } = plantData;
  let errors = [];

  if (!plantName) errors.push('Plant name is required.');
  if (!address) errors.push('Address is required.');
  if (!city) errors.push('City is required.');
  if (!stateProvince) errors.push('State/Province is required.');
  if (!country) errors.push('Country is required.');
  if (!zipPostalCode) errors.push('Zip/Postal Code is required.');
  if (!phoneNumber) errors.push('Phone number is required.');
  if (!email || !validateEmail(email)) errors.push('A valid email is required.');

  return errors;
}

// Validates asset profile form data
function validateAssetProfile(assetData) {
  const { assetName, plantId, capacity, rating, temperatureThreshold } = assetData;
  let errors = [];

  if (!assetName) errors.push('Asset name is required.');
  if (!plantId) errors.push('Plant is required.');
  if (!capacity) errors.push('Capacity is required.');
  if (!rating) errors.push('Rating is required.');
  if (temperatureThreshold === undefined) errors.push('Temperature threshold is required.');

  return errors;
}

// Validates sensor profile form data
function validateSensorProfile(sensorData) {
  const { sensorName, sensorFamily, sensorType, sensorVariant, assetId, position } = sensorData;
  let errors = [];

  if (!sensorName) errors.push('Sensor name is required.');
  if (!sensorFamily) errors.push('Sensor family is required.');
  if (!sensorType) errors.push('Sensor type is required.');
  if (!sensorVariant) errors.push('Sensor variant is required.');
  if (!assetId) errors.push('Asset is required.');
  if (position === undefined) errors.push('Sensor position is required.');

  return errors;
}

// Validates email using a simple regex pattern
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Export validation functions for use in other modules
module.exports = {
  validateCompanyProfile,
  validatePlantProfile,
  validateAssetProfile,
  validateSensorProfile,
  validateEmail
};