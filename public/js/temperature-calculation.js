const db = require('../scripts/database.js');

/**
 * Calculate daily temperature statistics for each sensor and update the database.
 * @param {Date} date - The date for which to calculate the statistics.
 */
async function calculateDailyTemperature(date) {
  try {
    // Convert date to YYYY-MM-DD format for database querying
    const dateString = date.toISOString().split('T')[0];

    // Fetch all sensor data for the given date
    const sensorData = await db.getSensorDataByDate(dateString);

    // Group data by sensor ID
    const groupedData = sensorData.reduce((acc, data) => {
      if (!acc[data.sensorId]) {
        acc[data.sensorId] = [];
      }
      acc[data.sensorId].push(data.temperature);
      return acc;
    }, {});

    // Calculate statistics for each sensor
    const stats = Object.keys(groupedData).map(sensorId => {
      const temperatures = groupedData[sensorId];
      const max = Math.max(...temperatures);
      const min = Math.min(...temperatures);
      const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

      return {
        sensorId,
        date: dateString,
        max,
        min,
        average
      };
    });

    // Update the database with the calculated statistics
    await db.updateDailyTemperatureStats(stats);

    // Check for any alarms triggered based on the calculated statistics
    await checkForTemperatureAlarms(stats);
  } catch (error) {
    console.error('Error calculating daily temperature:', error);
  }
}

/**
 * Check for temperature alarms based on the daily statistics and configured thresholds.
 * @param {Array} stats - The array of temperature statistics for each sensor.
 */
async function checkForTemperatureAlarms(stats) {
  try {
    // Fetch sensor threshold settings from the database
    const thresholds = await db.getSensorThresholds();

    // Check each sensor's statistics against its threshold
    stats.forEach(stat => {
      const threshold = thresholds[stat.sensorId];
      if (threshold) {
        if (stat.max >= threshold.temperatureThreshold) {
          // Trigger a red alarm if the max temperature exceeds the threshold
          db.triggerAlarm(stat.sensorId, 'red');
        } else {
          // Check for yellow alarm conditions based on configurable percentage increase and days
          const { percentageIncrease, days } = db.getYellowAlarmConfig();
          db.checkForYellowAlarm(stat.sensorId, percentageIncrease, days);
        }
      }
    });
  } catch (error) {
    console.error('Error checking for temperature alarms:', error);
  }
}

module.exports = {
  calculateDailyTemperature
};