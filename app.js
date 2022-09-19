let $timer = document.getElementById("timer");
let minutes = (seconds = milliseconds = hundredths = 0);
const $startStopButton = document.getElementById("startStopButton");
const $lapResetButton = document.getElementById("lapResetButton");
let timerId;

let isRunning = false;
let hasStarted = true;

const $lapTable = document.getElementById("lapTable");
let lapTableRow;
let lapNumber = 1;
let lapMinutes = (lapSeconds = lapMilliseconds = lapHundredths = 0);
let currentLap = (startingTimeCurrentLap = 0);

// ----------------------- //
function formatAndPrintTimeValues() {
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  hundredths = hundredths.toString().padStart(2, "0");
  $timer.innerText = `${minutes}:${seconds}.${hundredths}`;
}
function formatAndPrintLapValues() {
  lapMinutes = lapMinutes.toString().padStart(2, "0");
  lapSeconds = lapSeconds.toString().padStart(2, "0");
  lapHundredths = lapHundredths.toString().padStart(2, "0");
}

function updateTimeValues() {
  milliseconds += 10;
  minutes = Math.floor(milliseconds / 60000);
  seconds = Math.floor(milliseconds / 1000) % 60;
  hundredths = Math.floor((milliseconds % 1000) / 10);
  formatAndPrintTimeValues();
}

function updateCurrentLapValues() {
  lapMilliseconds += 10;
  lapMinutes = Math.floor(lapMilliseconds / 60000);
  lapSeconds = Math.floor(lapMilliseconds / 1000) % 60;
  lapHundredths = Math.floor((lapMilliseconds % 1000) / 10);
  formatAndPrintLapValues();
}

function registerNewLap() {
  currentLap = `${lapMinutes}:${lapSeconds}.${lapHundredths}`;
  lapTableRow = $lapTable.insertRow(0);
  lapTableRow.innerText = `Lap ${lapNumber} ${currentLap}`;
  lapTableRow.id = `lap-${lapNumber}`;
}

// ----------------------- //
$startStopButton.onclick = () => {
  if (!isRunning) {
    if (hasStarted) {
      hasStarted = false;
    } else {
      $lapResetButton.innerText = "Lap";
    }
    $startStopButton.innerText = "Stop";
    startingTimeCurrentLap = milliseconds;
    timerId = setInterval(updateTimeValues, 10);
  } else {
    $startStopButton.innerText = "Start";
    $lapResetButton.innerText = "Reset";
    clearInterval(timerId);
  }
  isRunning = !isRunning;
};

$lapResetButton.onclick = () => {
  if (!hasStarted) {
    if (!isRunning) {
      $startStopButton.innerText = "Start";
      $lapResetButton.innerText = "Lap";
      minutes = seconds = milliseconds = hundredths = 0;
      formatAndPrintTimeValues();
      $lapTable.innerHTML = "";
      lapNumber = 1;
    } else if (isRunning) {
      lapMilliseconds = milliseconds - startingTimeCurrentLap;
      updateCurrentLapValues();
      registerNewLap();
      ++lapNumber;
      startingTimeCurrentLap = milliseconds;
    }
  }
};
