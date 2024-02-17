// trend-analysis-tools.js
// This module provides tools for analyzing temperature trends from sensor data.

const { dbPath } = require('../scripts/database.js');

// Calculate the percentage change between two values
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) {
    return newValue !== 0 ? Infinity : 0;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}

// Analyze temperature trends for a given sensor over a specified number of days
function analyzeTemperatureTrend(sensorId, days, callback) {
  const sqlite3 = require('better-sqlite3');
  const db = new sqlite3(dbPath);

  // Calculate the date X days ago from today
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateString = date.toISOString().split('T')[0];

  // Query to get temperature data for the last Y days
  const query = `
    SELECT date, AVG(temperature) as avgTemp
    FROM temperature_data
    WHERE sensorId = ? AND date >= ?
    GROUP BY date
    ORDER BY date ASC
  `;

  try {
    const data = db.prepare(query).all(sensorId, dateString);
    if (data.length > 1) {
      // Calculate the percentage change between the first and last average temperature
      const percentageChange = calculatePercentageChange(data[0].avgTemp, data[data.length - 1].avgTemp);
      callback(null, percentageChange);
    } else {
      callback(new Error('Not enough data to analyze trend'));
    }
  } catch (error) {
    callback(error);
  } finally {
    db.close();
  }
}

// Export the trend analysis tools for use in other modules
module.exports = {
  analyzeTemperatureTrend
};