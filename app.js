let $timer = document.getElementById("timer");
let minutes = (seconds = milliseconds = hundredths = 0);
const $startStopButton = document.getElementById("startStopButton");
const $lapResetButton = document.getElementById("lapResetButton");
let timerId;

let isRunning = false;
let isFirstLap = true;

// ----------------------- //
function formatAndPrintTimeValues() {
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  hundredths = hundredths.toString().padStart(2, "0");
  $timer.innerText = `${minutes}:${seconds}.${hundredths}`;
}

function updateTimeValues() {
  milliseconds += 10;
  minutes = Math.floor(milliseconds / 60000);
  seconds = Math.floor(milliseconds / 1000) % 60;
  hundredths = Math.floor((milliseconds % 1000) / 10);
  formatAndPrintTimeValues();
}

// ----------------------- //
$startStopButton.onclick = () => {
  if (!isRunning) {
    if (isFirstLap) {
      isFirstLap = false;
    } else {
      $lapResetButton.innerText = "Lap";
    }
    $startStopButton.innerText = "Stop";
    timerId = setInterval(updateTimeValues, 10);
  } else {
    $startStopButton.innerText = "Start";
    $lapResetButton.innerText = "Reset";
    clearInterval(timerId);
  }
  isRunning = !isRunning;
};

$lapResetButton.onclick = () => {
  if (!isRunning && !isFirstLap) {
    $startStopButton.innerText = "Start";
    $lapResetButton.innerText = "Lap";
    minutes = seconds = milliseconds = hundredths = 0;
    formatAndPrintTimeValues();
  }
};
