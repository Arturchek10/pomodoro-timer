const timeElement = document.getElementById("timer");
const btnStartElement = document.getElementById("start-btn");
const btnResetElement = document.getElementById("reset-btn");
const sessionElement = document.getElementById("session-txt");
const breakCounterElement = document.getElementById("break-txt");
const breakCounterContent = breakCounterElement.innerHTML;
const sessionContent = sessionElement.innerHTML;
const resetSessionElement = document.getElementById("reset-session-svg");

const bodyElement = document.body;
// добавляем элементы для переключения режимов session/break
const sessionToggleElement = document.getElementById("session-time-toggle");
const breakToggleElement = document.getElementById("break-time-toggle");

let timerInterval = null;
let totalSessionMilliSeconds = 45 * 60 * 1000; // время нашего таймера в мс
let totalBreakMilliSeconds = 15 * 60 * 1000;

function startsSessionContentTimer() {
  let minutes = Math.floor(totalSessionMilliSeconds / 1000 / 60);
  let seconds = (totalSessionMilliSeconds / 1000) % 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  timeElement.innerHTML = `${minutes}:${seconds}`;
}
// рендерим на странице изначальные значения таймеров в зависимости от данных в totalSessionMilliSeconds\totalBreakMilliSeconds
function startsBreakContentTimer() {
  let minutes = Math.floor(totalBreakMilliSeconds / 1000 / 60);
  let seconds = Math.floor((totalBreakMilliSeconds / 1000) % 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timeElement.innerHTML = `${minutes}:${seconds}`;
}
//считаем когда таймер должен закончится. Date.now() возвращается время с 1970год в мс поэтому прибавляем наши миллисекунды
let endTime = null;
let mode = "session";

if (mode === "session") {
  startsSessionContentTimer();
} else {
  startsBreakContentTimer();
}

// сохраняем в переменную sessionCounter значение из sessionStorage если еще нет данных возвращаем 0
let sessionCounter = Number(sessionStorage.getItem("sessionCounter")) || 0;
let breakCounter = Number(sessionStorage.getItem("breakCounter")) || 0;
sessionElement.innerHTML = sessionContent + sessionCounter;
breakCounterElement.innerHTML = breakCounterContent + breakCounter;

// audio
let endAudioSession = new Audio("audio/time-is-up-sound.wav");
endAudioSession.volume = 0.2;
let endAudioBreak = new Audio("audio/time-is-up-sound.wav");
endAudioBreak.volume = 0.2;
let deathNoteThemeAudio = new Audio("audio/Death-Note-OST.m4a");
deathNoteThemeAudio.volume = 0.25;
let harryPotterThemeAudio = new Audio("audio/1-Hours-Harry-Potter-ASMR.m4a");
harryPotterThemeAudio.volume = 0.65;
harryPotterThemeAudio.currentTime = 1;
let classRoomThemeAudio = new Audio("audio/Study-With-Me-in-Class.m4a");
classRoomThemeAudio.volume = 0.45;

function myTimer() {
  // из полного времени вычитаем текущее время то есть большее на 1 секунду так как вызов раз в секунду
  // если endSessionTime был 1.600.000ms (600сек наш таймер) то мы вычитаем 1.001.000ms = 599.000 / 1000 = 599секунд и округляем
  let remainingTime = Math.round((endTime - Date.now()) / 1000); // считаем оставшееся время
  if (remainingTime >= 0) {
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    timeElement.innerHTML = `${minutes}:${seconds}`;
  }

  if (remainingTime <= 0) {
    resetTimer();
    remainingTime = 0;
    clearInterval(timerInterval);
  }
  if (remainingTime <= 0 && mode === "break") {
    endAudioBreak.play();
    breakCounter++;
    sessionStorage.setItem("breakCounter", breakCounter); // сохраняем значение в breakCounter
    breakCounterElement.innerHTML = breakCounterContent + breakCounter;
  } else if (remainingTime <= 0 && mode === "session") {
    endAudioSession.play();
    sessionCounter++;
    sessionStorage.setItem("sessionCounter", sessionCounter); // сохраняем значение в sessionStorage
    sessionElement.innerHTML = sessionContent + sessionCounter;
  }
}

function breakToggle() {
  mode = "break";
  checkToggle();
}
function sessionToggle() {
  mode = "session";
  checkToggle();
}

function checkToggle() {
  if (mode === "session") {
    bodyElement.classList.remove("break");
    bodyElement.classList.add("session");
  } else if (mode === "break") {
    bodyElement.classList.remove("session");
    bodyElement.classList.add("break");
  }
  resetTimer();
}

function startTimer() {
  if (timerInterval !== null) {
    return;
  }
  if (mode === "session") {
    endTime = Date.now() + totalSessionMilliSeconds;
  }
  if (mode === "break") {
    endTime = Date.now() + totalBreakMilliSeconds;
  }

  myTimer();
  timerInterval = setInterval(myTimer, 1000);
}

function resetTimer() {
  if (mode === "session") {
    endTime = Date.now() + totalSessionMilliSeconds; // обновляем время предположительного заканчивания таймера
    startsSessionContentTimer();
  } else if (mode === "break") {
    endTime = Date.now() + totalBreakMilliSeconds; // обновляем время предположительного заканчивания таймера
    startsBreakContentTimer();
  }

  clearInterval(timerInterval);
  timerInterval = null;
}

function resetSession() {
  sessionCounter = 0;
  breakCounter = 0;
  sessionStorage.setItem("breakCounter", breakCounter);
  sessionStorage.setItem("sessionCounter", sessionCounter);
  sessionElement.innerHTML =
    sessionContent + sessionStorage.getItem("sessionCounter");
  breakCounterElement.innerHTML =
    breakCounterContent + sessionStorage.getItem("breakCounter");
}

btnStartElement.addEventListener("click", startTimer);
btnResetElement.addEventListener("click", resetTimer);
resetSessionElement.addEventListener("click", resetSession);
breakToggleElement.addEventListener("click", breakToggle);
sessionToggleElement.addEventListener("click", sessionToggle);

// logic of playing theme music when we clicked on image

const hpThemeElement = document.getElementById("hp-theme");
const dtThemeElement = document.getElementById("dn-theme");
const crThemeElement = document.getElementById("cr-theme");

let activeThemeName = null;
let activeAudio = null;
function activateAudio(theme) {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio.volume = volumeVal
  }
  if (theme == "Harry Potter") {
    harryPotterThemeAudio.play();
    activeAudio = harryPotterThemeAudio;
    activeAudio.volume = volumeVal
  } else if (theme == "Death Note") {
    deathNoteThemeAudio.play();
    activeAudio = deathNoteThemeAudio;
    activeAudio.volume = volumeVal
  } else if (theme == "Class Room") {
    classRoomThemeAudio.play();
    activeAudio = classRoomThemeAudio;
    activeAudio.volume = volumeVal
  }
}

let activeThemeElement = null;
const themes = document.querySelectorAll(".carousel-div > div");
themes.forEach((theme) => {
  const img = theme.querySelector(".theme-img");
  const clickText = theme.querySelector(".text-select");
  const selectText = theme.querySelector(".select-hp");

  function activateTheme() {
    // если нажимаем на новую тему а ранее была выбрана другая
    if (activeThemeElement && activeThemeElement !== theme) {
      const oldClickText = activeThemeElement.querySelector(".text-select"); //удаляем стили у старой темы, потому что
      const oldSelectText = activeThemeElement.querySelector(".select-hp"); // состояние activeThemeElement еще не поменялось на новую тему
      oldClickText.classList.remove("deactive");
      oldSelectText.classList.remove("active");
    }
    // если выбрана та же самая тема
    if (activeThemeElement === theme) {
      clickText.classList.remove("deactive");
      selectText.classList.remove("active");
      activeThemeElement = null;
      // если нажата уже выбранная тема выключаем любую музыку
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = null;
      }
      return;
    }

    clickText.classList.add("deactive");
    selectText.classList.add("active");
    activeThemeElement = theme; // сохраняем тему на которую кликнули после всех проверок

    // обновляем имя темы
    if (theme.id === "hp-theme") {
      activeThemeName = "Harry Potter";
      activateAudio(activeThemeName);
    } else if (theme.id === "dn-theme") {
      activeThemeName = "Death Note";
      activateAudio(activeThemeName);
    } else if (theme.id === "cr-theme") {
      activeThemeName = "Class Room";
      activateAudio(activeThemeName);
    }
  }

  img.addEventListener("click", activateTheme);
});



const volumeValueElement = document.getElementById('volumeValue')
const plusBtnElement = document.getElementById('plusBtn')
const minusBtnElement = document.getElementById('minusBtn')
let volumeVal = 0.5
volumeValueElement.innerHTML = volumeVal

function updateVolumeDisplay(volume){
  volumeVal = Number(volume.toFixed(2))
  volumeValueElement.innerHTML = volumeVal
  if (activeAudio){
    activeAudio.volume = volumeVal
  }
}
function increaseVolume(){
  if (volumeVal < 1){
    if(volumeVal < 0.1){
      updateVolumeDisplay(volumeVal + 0.01)
    } else {
      updateVolumeDisplay(volumeVal + 0.1)
    }
  }
}
function decreaseVolume(){
  if(volumeVal > 0.01){
    if(volumeVal <= 0.1){
      updateVolumeDisplay(volumeVal - 0.01)
    } else {
      updateVolumeDisplay(volumeVal - 0.1)
    }
  }
}

plusBtnElement.addEventListener("click", increaseVolume)
minusBtnElement.addEventListener("click", decreaseVolume)