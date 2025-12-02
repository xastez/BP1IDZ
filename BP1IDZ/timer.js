
function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        period: parseInt(urlParams.get('period')) || 60,
        action: urlParams.get('action') || 'stop'
    };
}

if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

let timerInterval;
let remainingTime;
let settings = getParams();

const timeDisplay = document.getElementById('time');
const periodInput = document.getElementById('period');
const actionSelect = document.getElementById('action');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(remainingTime);
    document.title = `${formatTime(remainingTime)} - Таймер`;
}

function notifyUser() {
    if (Notification.permission === "granted") {
        new Notification("Таймер завершився!", { body: `Дія: ${settings.action}` });
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        remainingTime--;
        updateDisplay();

        if (remainingTime <= 0) {
            notifyUser();
            if (settings.action === 'repeat') {
                remainingTime = parseInt(periodInput.value) || settings.period;
            } else {
                clearInterval(timerInterval);
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    remainingTime = parseInt(periodInput.value) || settings.period;
    updateDisplay();
}

remainingTime = parseInt(periodInput.value) || settings.period;
actionSelect.value = settings.action;
updateDisplay();

// --- Обробка подій ---
startBtn.addEventListener('click', () => {
    settings.period = parseInt(periodInput.value);
    settings.action = actionSelect.value;
    remainingTime = parseInt(periodInput.value);
    startTimer();
});

pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
