Shared Dependencies:

**Exported Variables:**
- `dbPath`: Path to the SQLite database file.
- `temperatureUnit`: Variable to toggle between Fahrenheit and Celsius.

**Data Schemas:**
- `Company`: `{ companyName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email }`
- `Plant`: `{ plantName, address, city, stateProvince, country, zipPostalCode, phoneNumber, email }`
- `Asset`: `{ assetName, plantId, capacity, rating, temperatureThreshold }`
- `Sensor`: `{ sensorName, sensorFamily, sensorType, sensorVariant, assetId, position }`

**ID Names of DOM Elements:**
- `#temperature-chart`: For displaying the temperature chart.
- `#polar-trend-plot`: For displaying the polar trend plot.
- `#historic-trend-plot`: For displaying the historic trend plot.
- `#sensor-cards-container`: Container for sensor cards.
- `#settings-modal`: Modal for app settings.
- `#company-profile-form`: Form for company profile settings.
- `#plant-profile-form`: Form for plant profile settings.
- `#asset-profile-form`: Form for asset profile settings.
- `#sensor-profile-form`: Form for sensor profile settings.
- `#daq-configuration-form`: Form for DAQ configuration settings.
- `#alerts-configuration-form`: Form for alerts and alarms settings.
- `#theme-toggle`: Toggle switch for dark/light mode.

**Message Names:**
- `temperature-update`: Message for temperature data update.
- `alarm-triggered`: Message for when an alarm is triggered.
- `database-imported`: Message for when a database is imported.
- `database-exported`: Message for when a database is exported.

**Function Names:**
- `initializeDatabase`: Function to set up the initial database.
- `updateTemperatureData`: Function to update temperature data in real-time.
- `calculateDailyTemperature`: Function to calculate daily max, min, and average temperatures.
- `configureDAQ`: Function to configure DAQ settings.
- `configureAlerts`: Function to configure alerts and alarms.
- `toggleTheme`: Function to switch between dark and light mode.
- `generateMockData`: Function to generate mock data for demo mode.
- `sendNotification`: Function to send system notifications.
- `sendEmailAlert`: Function to send email alerts.
- `saveDatabaseState`: Function to save the current state of the database.
- `openDatabase`: Function to open a database from the user's machine.
- `createSensorCard`: Function to create a card for each sensor.
- `updateChart`: Function to update the chart with new data.
- `updatePolarPlot`: Function to update the polar trend plot.
- `updateHistoricTrend`: Function to update the historic trend plot.
- `showSettings`: Function to show settings in a popup window.
- `showDemoMode`: Function to activate demo mode with mock data.
- `convertTemperatureUnit`: Function to convert temperature between Fahrenheit and Celsius.
- `validateForm`: Function to validate forms in settings.
- `handleFormSubmit`: Function to handle form submissions.
- `importDatabase`: Function to import a database file.
- `exportDatabase`: Function to export the database to a file.
- `analyzeTrends`: Function to perform trend analysis on historical data.
- `recordTemperatureData`: Function to record temperature data into the database.
- `configureAlarmEngine`: Function to configure the alarm engine.
- `showStartupConfigPopup`: Function to show the startup configuration popup.
- `generateRealTimeData`: Function to generate real-time sensor data.
- `displayLicenseEULA`: Function to display license and EULA information.
- `generateReadme`: Function to generate the README file content.