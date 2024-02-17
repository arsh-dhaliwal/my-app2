// temperature-unit-toggle.js
// This script handles the toggling of temperature units between Fahrenheit and Celsius.

const { ipcRenderer } = require('electron');

// Shared variable for temperature unit across the application
let temperatureUnit = 'Celsius'; // Default unit

// Function to convert temperature from Celsius to Fahrenheit
function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Function to convert temperature from Fahrenheit to Celsius
function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

// Function to update all temperature displays in the UI
function updateTemperatureDisplays() {
  // Query all elements that display temperature
  const temperatureElements = document.querySelectorAll('.temperature-display');

  temperatureElements.forEach((element) => {
    // Get the current value in the element
    const currentValue = parseFloat(element.textContent);

    // Convert the temperature based on the selected unit
    const newValue =
      temperatureUnit === 'Celsius' ? toCelsius(currentValue) : toFahrenheit(currentValue);

    // Update the element with the new temperature value
    element.textContent = newValue.toFixed(2);
  });
}

// Function to toggle the temperature unit
function toggleTemperatureUnit() {
  // Toggle the temperature unit variable
  temperatureUnit = temperatureUnit === 'Celsius' ? 'Fahrenheit' : 'Celsius';

  // Update the UI to reflect the new temperature unit
  const unitDisplayElements = document.querySelectorAll('.unit-display');
  unitDisplayElements.forEach((element) => {
    element.textContent = temperatureUnit;
  });

  // Update all temperature displays with the new unit
  updateTemperatureDisplays();

  // Send a message to the main process to update the shared temperature unit variable
  ipcRenderer.send('update-temperature-unit', temperatureUnit);
}

// Event listener for the temperature unit toggle button
document.getElementById('temperature-unit-toggle').addEventListener('click', toggleTemperatureUnit);

// Initial setup to display the default temperature unit on load
document.addEventListener('DOMContentLoaded', () => {
  const unitDisplayElements = document.querySelectorAll('.unit-display');
  unitDisplayElements.forEach((element) => {
    element.textContent = temperatureUnit;
  });
});