const { exec } = require('child_process');
const path = require('path');

// Path to the bash script
const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'monitor.sh');

// Cache configuration
let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 3000; // 3 seconds

// Lock mechanism to prevent overlapping executions
let isExecuting = false;

/**
 * Service to execute the monitor script and parse its output.
 */
const getSystemStats = () => {
  return new Promise((resolve, reject) => {
    // Check cache
    const now = Date.now();
    if (cachedData && (now - lastFetchTime < CACHE_TTL)) {
      return resolve(cachedData);
    }

    // Prevent overlapping executions
    if (isExecuting) {
      // If already executing, wait a bit or return cache (even if stale)
      // For this implementation, we return stale cache if available
      if (cachedData) return resolve(cachedData);
      return reject(new Error('Monitor script is already running'));
    }

    isExecuting = true;

    const SCRIPT_PATH_PS = path.join(__dirname, '..', 'scripts', 'monitor.ps1');
    let command;
    if (process.platform === 'win32') {
      // Use the PowerShell script on Windows
      command = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${SCRIPT_PATH_PS}"`;
    } else {
      // Use the Bash script on Linux/Mac
      command = `bash "${SCRIPT_PATH}"`;
    }

    exec(command, (error, stdout, stderr) => {
      isExecuting = false;

      if (error) {
        console.error(`Execution error: ${error.message}`);
        return reject(new Error('Failed to retrieve system metrics'));
      }

      try {
        const data = JSON.parse(stdout);
        cachedData = data;
        lastFetchTime = Date.now();
        resolve(data);
      } catch (parseError) {
        console.error(`Failed to parse output: ${stdout}`);
        reject(new Error('Failed to parse monitoring data'));
      }
    });
  });
};

module.exports = {
  getSystemStats
};
