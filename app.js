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
      $lapResetButton.classList.replace("unabled-lap-button", "lap-reset-button");
      isOnZero = false;
      registerNewLap();
    } else {
      $lapResetButton.innerText = "Lap";
    }
    $startStopButton.classList.replace("start-button", "stop-button");
    $startStopButton.innerText = "Stop";
    startingTimeCurrentLap = milliseconds;
    timerId = setInterval(updateTimeValues, 10);
  } else {
    $startStopButton.classList.replace("stop-button", "start-button");
    $startStopButton.innerText = "Start";
    $lapResetButton.innerText = "Reset";
    clearInterval(timerId);
  }
  isRunning = !isRunning;
};

$lapResetButton.onclick = () => {
  if (!isOnZero) {
    if (!isRunning) {
      $lapResetButton.classList.replace("lap-reset-button", "unabled-lap-button");
      $startStopButton.innerText = "Start";
      $lapResetButton.innerText = "Lap";
      isOnZero = true;
      minutes = seconds = milliseconds = hundredths = 0;
      lapMinutes = lapSeconds = lapMilliseconds = lapHundredths = 0;
      lapNumber = 1;
      formatAndPrintTimeValues();
      $lapTable.innerHTML = "";
    } else {
      if (lapNumber === 1) {
        bestLapPosition = worstLapPosition = 1;
        bestLapMilliseconds = worstLapMilliseconds = lapMilliseconds;
      } else {
        if (lapMilliseconds < bestLapMilliseconds) {
          if (lapNumber > 2) {
            document.getElementById(`lap-${bestLapPosition}`).classList.remove("best-lap");
            document.getElementById(`lap-${lapNumber}`).classList.add("best-lap");
          }
          bestLapPosition = lapNumber;
          bestLapMilliseconds = lapMilliseconds;
        } else if (lapMilliseconds > worstLapMilliseconds) {
          if (lapNumber > 2) {
            document.getElementById(`lap-${worstLapPosition}`).classList.remove("worst-lap");
            document.getElementById(`lap-${lapNumber}`).classList.add("worst-lap");
          }
          worstLapPosition = lapNumber;
          worstLapMilliseconds = lapMilliseconds;
        }
      }
      if (lapNumber === 2) {
        document.getElementById(`lap-${bestLapPosition}`).classList.add("best-lap");
        document.getElementById(`lap-${worstLapPosition}`).classList.add("worst-lap");
      }
      console.log("BEST LAP POSITION: ", bestLapPosition, " BEST LAP MILLISECONDS: ", bestLapMilliseconds);
      console.log("WORST LAP POSITION:", worstLapPosition, " WORST LAP MILLISECONDS: ", worstLapMilliseconds);
      ++lapNumber;
      lapMilliseconds = 0;
      registerNewLap();
    }
  }
};
