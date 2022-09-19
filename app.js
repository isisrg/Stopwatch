let $timer = document.getElementById("timer");
let minutes = (seconds = milliseconds = hundredths = 0);
const $startStopButton = document.getElementById("startStopButton");
const $lapResetButton = document.getElementById("lapResetButton");
let timerId;

let isRunning = false;
let isOnZero = true;

const $lapTable = document.getElementById("lapTable");
let lapTableRow, lapTableLapNumberCell, lapTableTimeCell;
let lapNumber = 1;
let lapMinutes = (lapSeconds = lapMilliseconds = lapHundredths = 0);
let currentLap = (bestLapPosition = worstLapPosition = 0);

// ----------------------- //
function formatAndPrintTimeValues() {
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  hundredths = hundredths.toString().padStart(2, "0");
  $timer.innerText = `${minutes}:${seconds}.${hundredths}`;
}
function formatLapValues() {
  lapMinutes = lapMinutes.toString().padStart(2, "0");
  lapSeconds = lapSeconds.toString().padStart(2, "0");
  lapHundredths = lapHundredths.toString().padStart(2, "0");
}
function updateLapTimer() {
  currentLap = `${lapMinutes}:${lapSeconds}.${lapHundredths}`;
  lapTableTimeCell.innerText = `${currentLap}`;
}

function updateCurrentLapValues() {
  lapMilliseconds += 10;
  lapMinutes = Math.floor(lapMilliseconds / 60000);
  lapSeconds = Math.floor(lapMilliseconds / 1000) % 60;
  lapHundredths = Math.floor((lapMilliseconds % 1000) / 10);
  formatLapValues();
  updateLapTimer();
}
function updateTimeValues() {
  milliseconds += 10;
  minutes = Math.floor(milliseconds / 60000);
  seconds = Math.floor(milliseconds / 1000) % 60;
  hundredths = Math.floor((milliseconds % 1000) / 10);
  formatAndPrintTimeValues();
  updateCurrentLapValues();
}

function registerNewLap() {
  formatLapValues();
  lapTableRow = $lapTable.insertRow(0);
  lapTableRow.id = `lap-${lapNumber}`;
  lapTableLapNumberCell = lapTableRow.insertCell(0);
  lapTableLapNumberCell.innerText = `Lap ${lapNumber}`;
  lapTableTimeCell = lapTableRow.insertCell(1);
  updateLapTimer();
}

// ----------------------- //
$startStopButton.onclick = () => {
  if (!isRunning) {
    if (isOnZero) {
      isOnZero = false;
      registerNewLap();
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
  if (!isOnZero) {
    if (!isRunning) {
      $startStopButton.innerText = "Start";
      $lapResetButton.innerText = "Lap";
      isOnZero = true;
      minutes = seconds = milliseconds = hundredths = 0;
      lapMinutes = lapSeconds = lapMilliseconds = lapHundredths = 0;
      lapNumber = 1;
      formatAndPrintTimeValues();
      $lapTable.innerHTML = "";
    } else {
      ++lapNumber;
      lapMilliseconds = 0;
      registerNewLap();
    }
  }
};
