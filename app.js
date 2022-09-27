let $timer = document.getElementById("timer");
const $startStopButton = document.getElementById("startStopButton");
const $lapResetButton = document.getElementById("lapResetButton");
let timerId;

//Possible values: onZero, running, paused
let state = "onZero";

const $lapTable = document.getElementById("lapTable");
let lapTableTimeCell;
let lapNumber = 1;

// ----------------------- //
const mainTimer = {
  minutes: 0,
  seconds: 0,
  hundredths: 0,
  milliseconds: 0,
};

const lapTimer = {
  minutes: 0,
  seconds: 0,
  hundredths: 0,
  milliseconds: 0,
};

const bestWorstLapInfo = {
  bestLapPosition: 0,
  bestLapMilliseconds: 0,
  worstLapPosition: 0,
  worstLapMilliseconds: 0,
};
// ----------------------- //

function formatTimeValues(timer) {
  timer.minutes = timer.minutes.toString().padStart(2, "0");
  timer.seconds = timer.seconds.toString().padStart(2, "0");
  timer.hundredths = timer.hundredths.toString().padStart(2, "0");
}

function updateLapTimer() {
  let currentLap = `${lapTimer.minutes}:${lapTimer.seconds}.${lapTimer.hundredths}`;
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

function updateTimeValues(timer) {
  timer.milliseconds += 10;
  timer.minutes = Math.floor(timer.milliseconds / 60000);
  timer.seconds = Math.floor(timer.milliseconds / 1000) % 60;
  timer.hundredths = Math.floor((timer.milliseconds % 1000) / 10);
}

function updateAllTimeValues() {
  updateTimeValues(mainTimer);
  formatTimeValues(mainTimer);
  $timer.innerText = `${mainTimer.minutes}:${mainTimer.seconds}.${mainTimer.hundredths}`;
  updateTimeValues(lapTimer);
  formatTimeValues(lapTimer);
  updateLapTimer();
}

function registerNewLap() {
  formatTimeValues(lapTimer);
  if (lapNumber <= 6) deleteEmptyLapEntry();
  let lapTableRow = $lapTable.insertRow(0);
  lapTableRow.id = `lap-${lapNumber}`;
  let lapTableLapNumberCell = lapTableRow.insertCell(0);
  lapTableLapNumberCell.innerText = `Lap ${lapNumber}`;
  lapTableTimeCell = lapTableRow.insertCell(1);
  updateLapTimer();
}

function deleteEmptyLapEntry() {
  document.getElementById(`emptyRow${lapNumber}`).remove();
}

function createEmptyLapsEntries() {
  lapNumber = 6;
  while (lapNumber > 0) {
    let lapTableRow = $lapTable.insertRow(0);
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
  mainTimer.minutes = mainTimer.seconds = mainTimer.hundredths = mainTimer.milliseconds = 0;
  lapTimer.minutes = lapTimer.seconds = lapTimer.hundredths = lapTimer.milliseconds = 0;
  formatTimeValues(mainTimer);
  $timer.innerText = `${mainTimer.minutes}:${mainTimer.seconds}.${mainTimer.hundredths}`;
  $lapTable.innerHTML = "";
  createEmptyLapsEntries();
  lapNumber = 1;
}

function updateBestWorstLap() {
  if (lapNumber === 1) {
    bestWorstLapInfo.bestLapPosition = bestWorstLapInfo.worstLapPosition = 1;
    bestWorstLapInfo.bestLapMilliseconds = bestWorstLapInfo.worstLapMilliseconds = lapTimer.milliseconds;
  } else {
    if (lapTimer.milliseconds < bestWorstLapInfo.bestLapMilliseconds) {
      if (lapNumber > 2) document.getElementById(`lap-${bestWorstLapInfo.bestLapPosition}`).classList.remove("best-lap");
      bestWorstLapInfo.bestLapPosition = lapNumber;
      bestWorstLapInfo.bestLapMilliseconds = lapTimer.milliseconds;
    } else if (lapTimer.milliseconds > bestWorstLapInfo.worstLapMilliseconds) {
      if (lapNumber > 2) document.getElementById(`lap-${bestWorstLapInfo.worstLapPosition}`).classList.remove("worst-lap");
      bestWorstLapInfo.worstLapPosition = lapNumber;
      bestWorstLapInfo.worstLapMilliseconds = lapTimer.milliseconds;
    }
    document.getElementById(`lap-${bestWorstLapInfo.bestLapPosition}`).classList.add("best-lap");
    document.getElementById(`lap-${bestWorstLapInfo.worstLapPosition}`).classList.add("worst-lap");
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
    timerId = setInterval(updateAllTimeValues, 10);
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
    lapTimer.minutes = lapTimer.seconds = lapTimer.hundredths = lapTimer.milliseconds = 0;
    registerNewLap();
  }
};
