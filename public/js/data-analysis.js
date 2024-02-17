// data-analysis.js
// This module provides functions for analyzing temperature data trends.

const { dbPath } = require('../scripts/database.js');

// Import the database module
const Database = require('better-sqlite3');
const db = new Database(dbPath, { verbose: console.log });

// Function to calculate daily maximum, minimum, and average temperatures for each sensor
function calculateDailyTemperature() {
  const sql = `
    SELECT 
      sensorId, 
      MAX(temperature) AS maxTemperature, 
      MIN(temperature) AS minTemperature, 
      AVG(temperature) AS avgTemperature, 
      date(recordedAt) AS date
    FROM 
      temperatureReadings
    GROUP BY 
      sensorId, 
      date(recordedAt);
  `;
  try {
    const stmt = db.prepare(sql);
    const dailyTemps = stmt.all();
    return dailyTemps;
  } catch (error) {
    console.error('Error calculating daily temperatures:', error);
    return [];
  }
}

// Function to analyze temperature trends and determine if an alert should be triggered
function analyzeTemperatureTrends(xPercent, yDays) {
  const sql = `
    WITH RECURSIVE dates(date) AS (
      SELECT date('now', '-${yDays} days')
      UNION ALL
      SELECT date(date, '+1 day') FROM dates WHERE date < date('now')
    )
    SELECT 
      t.sensorId, 
      AVG(t.temperature) AS avgTemperature, 
      d.date
    FROM 
      dates d
    LEFT JOIN temperatureReadings t ON d.date = date(t.recordedAt)
    GROUP BY 
      t.sensorId, 
      d.date;
  `;
  try {
    const stmt = db.prepare(sql);
    const trends = stmt.all();
    const alerts = trends.reduce((acc, { sensorId, avgTemperature, date }) => {
      if (!acc[sensorId]) {
        acc[sensorId] = { dates: [], avgTemperatures: [] };
      }
      acc[sensorId].dates.push(date);
      acc[sensorId].avgTemperatures.push(avgTemperature);
      return acc;
    }, {});

    // Check for X% increase over the last Y days
    for (const sensorId in alerts) {
      const sensorData = alerts[sensorId];
      const temperatureIncrease = sensorData.avgTemperatures.some((temp, index, temps) => {
        if (index === 0) return false;
        return (temp - temps[index - 1]) / temps[index - 1] >= xPercent / 100;
      });
      if (temperatureIncrease) {
        // Trigger yellow alert
        sendNotification(sensorId, 'yellow');
      }
    }
  } catch (error) {
    console.error('Error analyzing temperature trends:', error);
  }
}

// Function to send a system notification
function sendNotification(sensorId, alertLevel) {
  // This function would integrate with the system notification service
  console.log(`Alert for Sensor ID ${sensorId}: Level ${alertLevel}`);
}

module.exports = {
  calculateDailyTemperature,
  analyzeTemperatureTrends
};