// This script toggles the theme between dark and light mode
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Load the theme from local storage if it exists
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
  if (currentTheme) {
    body.classList.add(currentTheme);
  }

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    }
  });
});

// Helper function to check if the dark mode is currently enabled
function isDarkModeEnabled() {
  return body.classList.contains('dark-mode');
}

// Helper function to apply the theme based on the user's preference
function applyThemePreference() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDarkScheme.matches) {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark-mode');
  } else {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light-mode');
  }
}

// Apply the theme preference on initial load
applyThemePreference();