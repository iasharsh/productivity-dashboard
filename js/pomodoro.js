const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const sessionLabel = document.querySelector(".session-label");

let workTime = 25 * 60;
let breakTime = 5 * 60;
let time = workTime;
let timerInterval;
let isRunning = false;
let isWorkSession = true;

function updateDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        pauseBtn.classList.remove("paused");
        timerInterval = setInterval(() => {
            if (time > 0) {
                time--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                switchSession();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    pauseBtn.classList.add("paused");
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    time = isWorkSession ? workTime : breakTime;
    updateDisplay();
    pauseBtn.classList.remove("paused");
}

function switchSession() {
    isWorkSession = !isWorkSession;
    sessionLabel.textContent = isWorkSession ? "Work Session" : "Break Session";
    time = isWorkSession ? workTime : breakTime;
    updateDisplay();
    startTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
