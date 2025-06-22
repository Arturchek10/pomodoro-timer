const timeElement = document.getElementById("timer");
const btnStartElement = document.getElementById("start-btn");
const btnResetElement = document.getElementById("reset-btn");
const sessionElement = document.getElementById("session-txt");
const sessionContent = sessionElement.innerHTML;
const resetSessionElement = document.getElementById("reset-session-svg");
sessionElement.innerHTML = sessionContent + 0;

const bodyElement = document.body;
// добавляем элементы для переключения режимов session/break
const sessionToggleElement = document.getElementById("session-time-toggle");
const breakToggleElement = document.getElementById("break-time-toggle");

let timerInterval = null;
let totalSessionMilliSeconds = 45 * 60 * 1000; // время нашего таймера в мс
let totalBreakMilliSeconds = 15 * 60 * 1000;
//считаем когда таймер должен закончится. Date.now() возвращается время с 1970год в мс поэтому прибавляем наши миллисекунды
let endTime = null;
let mode = "session";
let sessionCounter = 0;

// audio
let endAudioSession = new Audio("audio/");
endAudioSession.volume = 0.1;
let endAudioBreak = new Audio("audio/time-is-up-sound.wav");
endAudioBreak.volume = 0.05;
let deathNoteThemeAudio = new Audio("/site/audio/Death-Note-OST.m4a");
deathNoteThemeAudio.volume = 0.25;
let harryPotterThemeAudio = new Audio("/site/audio/4-Hours-Harry-Potter-ASMR.m4a");
harryPotterThemeAudio.volume = 0.65;
harryPotterThemeAudio.currentTime = 1;
let classRoomThemeAudio = new Audio("/site/audio/Study-With-Me-in-Class.m4a");
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
    // // endAudioSession.play();
    // setTimeout(() => {
    //   endAudioSession.pause();
    //   endAudioSession.currentTime = 0;
    // }, 10000);
    resetTimer();
    remainingTime = 0;
    clearInterval(timerInterval);
    sessionCounter++;
    sessionElement.innerHTML = sessionContent + sessionCounter;
  }
  if (remainingTime <= 0 && mode === "break") {
    endAudioSession.play();
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
    timeElement.innerHTML = "45:00";
    bodyElement.style["background-image"] = 'url("images/sky-bg.jpeg")';
  } else if (mode === "break") {
    timeElement.innerHTML = "15:00";
    bodyElement.style["background-image"] =
      'url("images/fall-autumn-red-season.jpg")';
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
    timeElement.innerHTML = "45:00";
  } else if (mode === "break") {
    endTime = Date.now() + totalBreakMilliSeconds; // обновляем время предположительного заканчивания таймера
    timeElement.innerHTML = "15:00";
  }

  clearInterval(timerInterval);
  timerInterval = null;
}

function resetSession() {
  sessionCounter = 0;
  sessionElement.innerHTML = sessionContent + sessionCounter;
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
  }
  if (theme == "Harry Potter") {
    harryPotterThemeAudio.play();
    activeAudio = harryPotterThemeAudio;
  } else if (theme == "Death Note") {
    deathNoteThemeAudio.play();
    activeAudio = deathNoteThemeAudio;
  } else if (theme == "Class Room") {
    classRoomThemeAudio.play();
    activeAudio = classRoomThemeAudio;
  }
}

let activeThemeElement = null;
const themes = document.querySelectorAll(".carousel-div > div");
themes.forEach((theme) => {
  const img = theme.querySelector(".theme-img");
  const clickText = theme.querySelector(".text-select");
  const selectText = theme.querySelector(".select-hp");

  function activateTheme() {
    console.log(activeThemeElement);
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

    console.log("activeThemeElement: " + activeThemeElement.id);
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
