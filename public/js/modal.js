// modal.js - This script handles the creation and management of modal windows for the ThermWatch app.

class Modal {
  constructor(modalId, closeId) {
    this.modal = document.getElementById(modalId);
    this.closeButton = document.getElementById(closeId);
    this.init();
  }

  init() {
    // When the user clicks on the close button, close the modal
    this.closeButton.onclick = () => {
      this.close();
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    };
  }

  open() {
    // Open the modal by setting it to display block
    this.modal.style.display = 'block';
  }

  close() {
    // Close the modal by setting it to display none
    this.modal.style.display = 'none';
  }
}

// Function to show settings in a popup window
function showSettings() {
  const settingsModal = new Modal('settings-modal', 'settings-close');
  settingsModal.open();
}

// Function to show the startup configuration popup
function showStartupConfigPopup() {
  const startupConfigModal = new Modal('startup-config-modal', 'startup-config-close');
  startupConfigModal.open();
}

// Export the Modal class and functions for use in other scripts
export { Modal, showSettings, showStartupConfigPopup };