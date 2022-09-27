let $timer = document.getElementById("timer");
let minutes = (seconds = milliseconds = hundredths = 0);
const $startStopButton = document.getElementById("startStopButton");
const $lapResetButton = document.getElementById("lapResetButton");
let timerId;

let state = "onZero";

const $lapTable = document.getElementById("lapTable");
let lapTableRow, lapTableLapNumberCell, lapTableTimeCell;
let lapNumber = 1;
let lapMinutes = (lapSeconds = lapMilliseconds = lapHundredths = 0);
let currentLap = (bestLapPosition = worstLapPosition = bestLapMilliseconds = worstLapMilliseconds = 0);

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

function formatTimeValues(testTimer) {
  testTimer.minutes = testTimer.minutes.toString().padStart(2, "0");
  testTimer.seconds = testTimer.seconds.toString().padStart(2, "0");
  testTimer.hundredths = testTimer.hundredths.toString().padStart(2, "0");
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
  if (lapNumber <= 6) deleteEmptyLapEntry();
  lapTableRow = $lapTable.insertRow(0);
  lapTableRow.id = `lap-${lapNumber}`;
  lapTableLapNumberCell = lapTableRow.insertCell(0);
  lapTableLapNumberCell.innerText = `Lap ${lapNumber}`;
  lapTableTimeCell = lapTableRow.insertCell(1);
  updateLapTimer();
}

function deleteEmptyLapEntry() {
  document.getElementById(`emptyRow${lapNumber}`).remove();
}

function createEmptyLapEntry() {
  lapNumber = 6;
  while (lapNumber > 0) {
    lapTableRow = $lapTable.insertRow(0);
    lapTableRow.id = `emptyRow${lapNumber}`;
    lapTableRow.insertCell(0);
    --lapNumber;
  }
}

function initialize() {
  $lapResetButton.classList.replace("lap-reset-button", "unabled-lap-button");
  $startStopButton.innerText = "Start";
  $lapResetButton.innerText = "Lap";
  state = "onZero";
  minutes = seconds = milliseconds = hundredths = 0;
  lapMinutes = lapSeconds = lapMilliseconds = lapHundredths = 0;
  formatAndPrintTimeValues();
  $lapTable.innerHTML = "";
  createEmptyLapEntry();
  lapNumber = 1;
}

function updateBestWorstLap() {
  if (lapNumber === 1) {
    bestLapPosition = worstLapPosition = 1;
    bestLapMilliseconds = worstLapMilliseconds = lapMilliseconds;
  } else {
    if (lapMilliseconds < bestLapMilliseconds) {
      if (lapNumber > 2) document.getElementById(`lap-${bestLapPosition}`).classList.remove("best-lap");
      bestLapPosition = lapNumber;
      bestLapMilliseconds = lapMilliseconds;
    } else if (lapMilliseconds > worstLapMilliseconds) {
      if (lapNumber > 2) document.getElementById(`lap-${worstLapPosition}`).classList.remove("worst-lap");
      worstLapPosition = lapNumber;
      worstLapMilliseconds = lapMilliseconds;
    }
    document.getElementById(`lap-${bestLapPosition}`).classList.add("best-lap");
    document.getElementById(`lap-${worstLapPosition}`).classList.add("worst-lap");
  }
}

// ----------------------- //
$startStopButton.onclick = () => {
  if (state === "onZero" || state === "paused") {
    if (state === "onZero") {
      $lapResetButton.classList.replace("unabled-lap-button", "lap-reset-button");
      isOnZero = false;
      registerNewLap();
    } else if (state === "paused") $lapResetButton.innerText = "Lap";
    $startStopButton.classList.replace("start-button", "stop-button");
    $startStopButton.innerText = "Stop";
    startingTimeCurrentLap = milliseconds;
    timerId = setInterval(updateTimeValues, 10);
    state = "running";
  } else if (state === "running") {
    $startStopButton.classList.replace("stop-button", "start-button");
    $startStopButton.innerText = "Start";
    $lapResetButton.innerText = "Reset";
    clearInterval(timerId);
    state = "paused";
  }
};

$lapResetButton.onclick = () => {
  if (state === "paused") initialize();
  if (state === "running") {
    updateBestWorstLap();
    ++lapNumber;
    lapMilliseconds = 0;
    registerNewLap();
  }
};
