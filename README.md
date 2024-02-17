# ThermWatch

ThermWatch is a temperature monitoring solution designed for high-value assets located inside plants. It serves plant operators by providing temperature data insights on assets, enabling better planning and operation of plant facilities.

## Features

- Single page dashboard application with real-time temperature data display.
- Database models for company, plant, asset, and sensor profiles.
- Ability to save and import the database state (.tmdb files).
- Configurable alerts and alarms based on temperature thresholds.
- DAQ system integration using Modbus and/or MQTT protocols.
- Historical data analysis with trend plots and charts.
- Dark and light mode UI with blue accents and customizable CSS.
- Demo mode with mock data generation for showcasing app features.
- Temperature unit toggle between Fahrenheit and Celsius.

## Setup Instructions

1. Ensure you have the latest version of Node.js installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the cloned directory and run `npm install` to install all dependencies.
4. To start the application, run `npm start`.

## Deployment

To package the application for production, run `npm run package`. This will create a distributable version of the app for your platform.

## Testing

Run `npm test` to execute the test suite. Ensure all tests pass before deploying or making changes to the application.

## Making Changes

To modify the application:

- Update the UI by editing the HTML and CSS files in the `public` directory.
- Add or modify functionality by editing the JavaScript files in the `scripts` directory.
- Adjust database schemas by modifying the SQL files in the `db/migrations` directory.

## Adding Logo

To add your company logo:

1. Place your logo image in the `assets` directory.
2. Update the `renderer.js` file to include the logo in the UI.

## Stack and Libraries

- Node.js (Runtime environment)
- Electron (Framework for desktop applications)
- better-sqlite3 (Database)
- Chart.js (Charting library)
- modbus-serial (Modbus communication)
- mqtt (MQTT protocol)
- node-notifier (System notifications)
- nodemailer (Email sending)

## Licensing

This application is intended for commercial use. Please refer to the `LICENSE.txt` file for the full license text. The End-User License Agreement (EULA) can be found in the `EULA.txt` file.

## Help Menu

The help menu within the application provides access to licensing information and the EULA. To view this information, navigate to the menu template and select "Help" followed by "License" or "EULA".

For further assistance or inquiries, please contact the support team.

## Contributing

If you wish to contribute to the development of ThermWatch, please submit a pull request with a clear description of your changes and any relevant tests.

## Acknowledgments

We would like to thank the open-source community for providing the tools and libraries that make this application possible.

---

Thank you for choosing ThermWatch for your plant operation needs.