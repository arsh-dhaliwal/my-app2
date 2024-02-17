const ModbusRTU = require("modbus-serial");
const mqtt = require("mqtt");
const { dbPath } = require("../scripts/database.js");

// DAQ configuration object
const daqConfig = {
  modbus: {
    enabled: false,
    client: null,
    connectionOptions: {
      host: '127.0.0.1',
      port: 502,
      unitId: 1
    }
  },
  mqtt: {
    enabled: false,
    client: null,
    connectionOptions: {
      host: 'mqtt://localhost',
      port: 1883
    }
  }
};

// Initialize Modbus connection
function initModbus() {
  if (daqConfig.modbus.enabled) {
    daqConfig.modbus.client = new ModbusRTU();
    daqConfig.modbus.client.connectTCP(daqConfig.modbus.connectionOptions.host, {
      port: daqConfig.modbus.connectionOptions.port
    });
    daqConfig.modbus.client.setID(daqConfig.modbus.connectionOptions.unitId);
  }
}

// Initialize MQTT connection
function initMQTT() {
  if (daqConfig.mqtt.enabled) {
    daqConfig.mqtt.client = mqtt.connect(daqConfig.mqtt.connectionOptions.host, {
      port: daqConfig.mqtt.connectionOptions.port
    });
  }
}

// Read temperature data from DAQ system
function readTemperatureData(sensorId, callback) {
  if (daqConfig.modbus.enabled) {
    // Replace with actual Modbus register address and length for temperature data
    const registerAddress = 0; // Placeholder
    const registerLength = 2; // Placeholder
    daqConfig.modbus.client.readHoldingRegisters(registerAddress, registerLength)
      .then(data => {
        const temperature = data.buffer.readFloatBE(); // Assuming temperature data is a float
        callback(null, temperature);
      })
      .catch(error => {
        callback(error);
      });
  } else if (daqConfig.mqtt.enabled) {
    // Subscribe to the topic for the sensor
    const topic = `sensor/${sensorId}/temperature`; // Placeholder for actual topic
    daqConfig.mqtt.client.subscribe(topic, (error) => {
      if (error) {
        callback(error);
      }
    });

    daqConfig.mqtt.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        const temperature = parseFloat(message.toString()); // Assuming temperature data is a float
        callback(null, temperature);
      }
    });
  } else {
    callback(new Error("No DAQ system enabled"));
  }
}

// Save temperature data to the database
function saveTemperatureData(sensorId, temperature) {
  // Placeholder for database saving logic
  // This function should insert the temperature data into the database
  // using the sensorId to link the data to the correct sensor
}

// Configure DAQ settings based on user input
function configureDAQ(settings) {
  if (settings.modbus) {
    daqConfig.modbus.enabled = true;
    daqConfig.modbus.connectionOptions = settings.modbus;
    initModbus();
  }
  if (settings.mqtt) {
    daqConfig.mqtt.enabled = true;
    daqConfig.mqtt.connectionOptions = settings.mqtt;
    initMQTT();
  }
}

module.exports = {
  configureDAQ,
  readTemperatureData,
  saveTemperatureData
};