const fs = require('fs');
const path = require('path');

function generateReadme() {
  const readmeContent = `# ThermWatch

## Overview
ThermWatch is a temperature monitoring solution for high-value assets located inside plants. It serves plant operators by providing temperature data insights on assets, enabling better planning of plant operations.

## Features
- Single page dashboard application with real-time temperature data display.
- Database management with models for company, plant, asset, and sensor profiles.
- Data acquisition (DAQ) configuration through Modbus and/or MQTT protocols.
- Alerts and alarms system with configurable thresholds and notifications.
- Dark and light mode UI with blue accents and customizable CSS.
- Demo mode with mock data generation for showcasing app features.

## Installation
1. Ensure you have the latest version of Node.js installed.
2. Clone the repository to your local machine.
3. Navigate to the cloned directory and run \`npm install\` to install dependencies.
4. To start the application, run \`npm start\`.

## Database Setup
The application uses Better-SQLite for database management. On first run, the database is created in the db folder with the required models. Use the \`db/init_db.js\` script to initialize the database.

## Configuration
The settings can be accessed from the menu template within the application. Configuration options include:
- Company, plant, asset, and sensor profiles.
- DAQ system setup for data acquisition.
- Alerts and alarms thresholds and notifications.

## Usage
- The main dashboard displays real-time temperature data for selected sensors.
- Users can switch between plants and assets using the selection bar.
- Temperature data is recorded and calculated on a daily cycle.

## Alerts and Alarms
- The system alerts the user if the asset temperature exceeds the set threshold.
- Alarm statuses are indicated by color codes: green (good), yellow (attention), and red (intervention).

## Demo Mode
Demo mode populates the application with mock data, including historical data back to 2018. It can be activated from the "options" menu.

## Customization
- UI colors can be changed from the CSS files located in the \`styles\` directory.
- To add a company logo, place the image file in the \`assets\` directory and reference it in the UI code.

## Dependencies
- Electron
- Better-SQLite3
- Chart.js
- modbus-serial
- mqtt

## Licensing
This is a commercial application. Please refer to the LICENSE.txt and EULA.txt files for the full licensing agreement and end-user license agreement.

## Support
For support, please contact [support email].

## Contributing
Contributions to ThermWatch are welcome. Please read the CONTRIBUTING.md file for guidelines on how to contribute.

## Authors
- [Author Name]

## Acknowledgments
- Thanks to all the contributors who have helped with the development of ThermWatch.

`;

  const readmePath = path.join(__dirname, '..', 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
}

// Call the function to generate the README.md file
generateReadme();