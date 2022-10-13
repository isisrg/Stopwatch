let $timer = document.getElementById("timer")
const $startStopButton = document.getElementById("startStopButton")
const $lapResetButton = document.getElementById("lapResetButton")
let timerId

//Possible values: onZero, running, paused
let state = "onZero"

const $lapTable = document.getElementById("lapTable")
let lapTableTimeCell
let lapNumber = 1

// ----------------------- //

let mainTimer = {
  minutes: 0,
  seconds: 0,
  hundredths: 0,
  milliseconds: 0,
  timerMilliseconds: 0,
  startingTime: 0,
}

let lapTimer = {
  minutes: 0,
  seconds: 0,
  hundredths: 0,
  milliseconds: 0,
  timerMilliseconds: 0,
  startingTime: 0,
}

const bestWorstLapInfo = {
  bestLapPosition: 0,
  bestLapMilliseconds: 0,
  worstLapPosition: 0,
  worstLapMilliseconds: 0,
}

// ----------------------- //

function updateTimeValues(timer) {
  timer.timerMilliseconds = Date.now() - timer.startingTime
  timer.startingTime = Date.now()
  timer.milliseconds += timer.timerMilliseconds
  timer.minutes = Math.floor(timer.milliseconds / 60000)
  timer.seconds = Math.floor(timer.milliseconds / 1000) % 60
  timer.hundredths = Math.floor((timer.milliseconds % 1000) / 10)
}

function formatTimeValues(timer) {
  timer.minutes = timer.minutes.toString().padStart(2, "0")
  timer.seconds = timer.seconds.toString().padStart(2, "0")
  timer.hundredths = timer.hundredths.toString().padStart(2, "0")
}

function updateLapTimer() {
  let currentLap = `${lapTimer.minutes}:${lapTimer.seconds}.${lapTimer.hundredths}`
  lapTableTimeCell.innerText = `${currentLap}`
}

function updateAllTimeValues() {
  updateTimeValues(mainTimer)
  formatTimeValues(mainTimer)
  $timer.innerText = `${mainTimer.minutes}:${mainTimer.seconds}.${mainTimer.hundredths}`
  updateTimeValues(lapTimer)
  formatTimeValues(lapTimer)
  updateLapTimer()
  timerId = requestAnimationFrame(updateAllTimeValues)
}

function registerNewLap() {
  formatTimeValues(lapTimer)
  if (lapNumber <= 6) deleteEmptyLapEntry()
  let lapTableRow = $lapTable.insertRow(0)
  lapTableRow.id = `lap-${lapNumber}`
  let lapTableLapNumberCell = lapTableRow.insertCell(0)
  lapTableLapNumberCell.innerText = `Lap ${lapNumber}`
  lapTableTimeCell = lapTableRow.insertCell(1)
  updateLapTimer()
}

function createEmptyLapsEntries() {
  lapNumber = 6
  while (lapNumber > 0) {
    let lapTableRow = $lapTable.insertRow(0)
    lapTableRow.id = `emptyRow${lapNumber}`
    lapTableRow.insertCell(0)
    --lapNumber
  }
}

function deleteEmptyLapEntry() {
  document.getElementById(`emptyRow${lapNumber}`).remove()
}

function updateState() {
  switch (state) {
    case "onZero":
    case "paused":
      state = "running"
      break
    case "running":
      state = "paused"
      break
    case "toReset":
      state = "onZero"
  }
}

function initializeTimers() {
  mainTimer.startingTime = Date.now()
  lapTimer.startingTime = Date.now()
}

function updateButtonsStyles() {
  switch (state) {
    case "onZero":
      $lapResetButton.classList.replace("unabled-lap-button", "lap-reset-button")
      $startStopButton.classList.replace("start-button", "stop-button")
      $startStopButton.innerText = "Stop"
      break
    case "paused":
      $lapResetButton.innerText = "Lap"
      $startStopButton.classList.replace("start-button", "stop-button")
      $startStopButton.innerText = "Stop"
      break
    case "running":
      $startStopButton.classList.replace("stop-button", "start-button")
      $startStopButton.innerText = "Start"
      $lapResetButton.innerText = "Reset"
      break
    case "toReset":
      $lapResetButton.classList.replace("lap-reset-button", "unabled-lap-button")
      $startStopButton.innerText = "Start"
      $lapResetButton.innerText = "Lap"
  }
}

function initialize() {
  state = "toReset"
  updateButtonsStyles()
  mainTimer = { minutes: 0, seconds: 0, hundredths: 0, milliseconds: 0, timerMilliseconds: 0, startingTime: 0 }
  lapTimer = { minutes: 0, seconds: 0, hundredths: 0, milliseconds: 0, timerMilliseconds: 0, startingTime: 0 }
  formatTimeValues(mainTimer)
  $timer.innerText = `${mainTimer.minutes}:${mainTimer.seconds}.${mainTimer.hundredths}`
  $lapTable.innerHTML = ""
  createEmptyLapsEntries()
  lapNumber = 1
  updateState()
}

function updateBestWorstLapValues() {
  switch (lapNumber) {
    case 1:
      bestWorstLapInfo.bestLapPosition = bestWorstLapInfo.worstLapPosition = 1
      bestWorstLapInfo.bestLapMilliseconds = bestWorstLapInfo.worstLapMilliseconds = lapTimer.milliseconds
      break
    case 2:
      if (lapTimer.milliseconds < bestWorstLapInfo.bestLapMilliseconds) {
        bestWorstLapInfo.bestLapPosition = lapNumber
        bestWorstLapInfo.bestLapMilliseconds = lapTimer.milliseconds
      } else if (lapTimer.milliseconds > bestWorstLapInfo.worstLapMilliseconds) {
        bestWorstLapInfo.worstLapPosition = lapNumber
        bestWorstLapInfo.worstLapMilliseconds = lapTimer.milliseconds
      }
    default:
      if (lapTimer.milliseconds < bestWorstLapInfo.bestLapMilliseconds) {
        bestWorstLapInfo.bestLapPosition = lapNumber
        bestWorstLapInfo.bestLapMilliseconds = lapTimer.milliseconds
      } else if (lapTimer.milliseconds > bestWorstLapInfo.worstLapMilliseconds) {
        bestWorstLapInfo.worstLapPosition = lapNumber
        bestWorstLapInfo.worstLapMilliseconds = lapTimer.milliseconds
      }
  }
}

function updateLapsStyles(toUpdate) {
  switch (toUpdate) {
    case "best":
      document.getElementById(`lap-${bestWorstLapInfo.bestLapPosition}`).classList.remove("best-lap")
      document.getElementById(`lap-${lapNumber}`).classList.add("best-lap")
      break
    case "worst":
      document.getElementById(`lap-${bestWorstLapInfo.worstLapPosition}`).classList.remove("worst-lap")
      document.getElementById(`lap-${lapNumber}`).classList.add("worst-lap")
      break
    case "second":
      document.getElementById(`lap-${bestWorstLapInfo.bestLapPosition}`).classList.add("best-lap")
      document.getElementById(`lap-${bestWorstLapInfo.worstLapPosition}`).classList.add("worst-lap")
  }
}

function updateBestWorstLap() {
  switch (lapNumber) {
    case 1:
      updateBestWorstLapValues()
      break
    case 2:
      updateBestWorstLapValues()
      updateLapsStyles("second")

    default:
      if (lapTimer.milliseconds < bestWorstLapInfo.bestLapMilliseconds) {
        updateLapsStyles("best")
        updateBestWorstLapValues()
      } else if (lapTimer.milliseconds > bestWorstLapInfo.worstLapMilliseconds) {
        updateLapsStyles("worst")
        updateBestWorstLapValues()
      }
  }
}

// ----------------------- //

$startStopButton.onclick = () => {
  switch (state) {
    case "onZero":
      updateButtonsStyles()
      registerNewLap()
      updateState()
      initializeTimers()
      timerId = requestAnimationFrame(updateAllTimeValues)
      break
    case "paused":
      updateButtonsStyles()
      updateState()
      initializeTimers()
      timerId = requestAnimationFrame(updateAllTimeValues)
      break
    case "running":
      updateButtonsStyles()
      cancelAnimationFrame(timerId)
      updateState()
      initializeTimers()
  }
}

$lapResetButton.onclick = () => {
  switch (state) {
    case "paused":
      initialize()
      break
    case "running":
      updateBestWorstLap()
      ++lapNumber
      lapTimer = { minutes: 0, seconds: 0, hundredths: 0, milliseconds: 0, timerMilliseconds: 0, startingTime: Date.now() }
      registerNewLap()
  }
}
