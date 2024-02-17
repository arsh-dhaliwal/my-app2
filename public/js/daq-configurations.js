// DAQ Configuration Page Script
// This script handles the DAQ configuration for the ThermWatch app.
// It allows users to set up their data acquisition system using Modbus and/or MQTT protocols.

const { ipcRenderer } = require('electron');
const modbus = require('modbus-serial');
const mqtt = require('mqtt');

// DAQ Configuration Object
let daqConfig = {
  useModbus: false,
  useMQTT: false,
  modbusSettings: {
    host: '',
    port: null,
    unitId: null
  },
  mqttSettings: {
    brokerUrl: '',
    topic: ''
  }
};

// Function to initialize DAQ settings from the configuration form
function initializeDAQSettings() {
  const modbusCheckbox = document.getElementById('use-modbus');
  const mqttCheckbox = document.getElementById('use-mqtt');
  const modbusHostInput = document.getElementById('modbus-host');
  const modbusPortInput = document.getElementById('modbus-port');
  const modbusUnitIdInput = document.getElementById('modbus-unit-id');
  const mqttBrokerInput = document.getElementById('mqtt-broker-url');
  const mqttTopicInput = document.getElementById('mqtt-topic');

  // Event listeners for DAQ configuration form inputs
  modbusCheckbox.addEventListener('change', (event) => {
    daqConfig.useModbus = event.target.checked;
  });

  mqttCheckbox.addEventListener('change', (event) => {
    daqConfig.useMQTT = event.target.checked;
  });

  modbusHostInput.addEventListener('input', (event) => {
    daqConfig.modbusSettings.host = event.target.value;
  });

  modbusPortInput.addEventListener('input', (event) => {
    daqConfig.modbusSettings.port = parseInt(event.target.value, 10);
  });

  modbusUnitIdInput.addEventListener('input', (event) => {
    daqConfig.modbusSettings.unitId = parseInt(event.target.value, 10);
  });

  mqttBrokerInput.addEventListener('input', (event) => {
    daqConfig.mqttSettings.brokerUrl = event.target.value;
  });

  mqttTopicInput.addEventListener('input', (event) => {
    daqConfig.mqttSettings.topic = event.target.value;
  });
}

// Function to connect to Modbus
function connectModbus() {
  if (daqConfig.useModbus) {
    const client = new modbus();
    client.connectTCP(daqConfig.modbusSettings.host, { port: daqConfig.modbusSettings.port });
    client.setID(daqConfig.modbusSettings.unitId);
    // Additional Modbus setup and event handling code goes here
  }
}

// Function to connect to MQTT Broker
function connectMQTT() {
  if (daqConfig.useMQTT) {
    const client = mqtt.connect(daqConfig.mqttSettings.brokerUrl);
    client.on('connect', () => {
      client.subscribe(daqConfig.mqttSettings.topic);
    });
    // Additional MQTT setup and event handling code goes here
  }
}

// Function to save DAQ configuration settings
function saveDAQSettings() {
  ipcRenderer.send('save-daq-settings', daqConfig);
}

// Function to load DAQ configuration settings
function loadDAQSettings() {
  ipcRenderer.on('load-daq-settings', (event, config) => {
    if (config) {
      daqConfig = config;
      // Update form inputs with loaded configuration
      document.getElementById('use-modbus').checked = daqConfig.useModbus;
      document.getElementById('use-mqtt').checked = daqConfig.useMQTT;
      document.getElementById('modbus-host').value = daqConfig.modbusSettings.host;
      document.getElementById('modbus-port').value = daqConfig.modbusSettings.port;
      document.getElementById('modbus-unit-id').value = daqConfig.modbusSettings.unitId;
      document.getElementById('mqtt-broker-url').value = daqConfig.mqttSettings.brokerUrl;
      document.getElementById('mqtt-topic').value = daqConfig.mqttSettings.topic;
    }
  });
  ipcRenderer.send('request-daq-settings');
}

// Initialize DAQ settings when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeDAQSettings();
  loadDAQSettings();
});

// Export functions for use in other modules
module.exports = {
  saveDAQSettings,
  loadDAQSettings,
  connectModbus,
  connectMQTT
};