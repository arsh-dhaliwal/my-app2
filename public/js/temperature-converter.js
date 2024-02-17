// temperature-converter.js
// This module provides functionality to convert temperature between Fahrenheit and Celsius.

// Shared variable for temperature unit
let temperatureUnit = 'C'; // Default to Celsius

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

// Function to toggle the temperature unit between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  temperatureUnit = temperatureUnit === 'C' ? 'F' : 'C';
  // Emit an event to update the UI with the new temperature unit
  const event = new CustomEvent('temperature-unit-changed', { detail: { temperatureUnit } });
  document.dispatchEvent(event);
}

// Function to convert temperature based on the current unit
function convertTemperature(temperature) {
  if (temperatureUnit === 'C') {
    return fahrenheitToCelsius(temperature);
  } else {
    return celsiusToFahrenheit(temperature);
  }
}

// Listen for the temperature unit toggle event from the UI
document.addEventListener('toggle-temperature-unit', () => {
  toggleTemperatureUnit();
});

// Export the functions for use in other modules
module.exports = {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  toggleTemperatureUnit,
  convertTemperature
};