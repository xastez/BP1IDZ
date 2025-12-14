// --- Отримання параметрів із адресного рядка ---
function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        period: parseInt(urlParams.get('period')) || 60,     // період таймера у секундах
        action: urlParams.get('action') || 'stop'            // дія після завершення (stop / repeat / start)
    };
}

// --- Запит дозволу на сповіщення ---
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// --- Глобальні змінні ---
let timerInterval;
let remainingTime;
let settings = getParams();

// --- Елементи інтерфейсу ---
const timeDisplay = document.getElementById('time');
const periodInput = document.getElementById('period');
const actionSelect = document.getElementById('action');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

// --- Форматування часу ---
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// --- Оновлення відображення часу ---
function updateDisplay() {
    timeDisplay.textContent = formatTime(remainingTime);
    document.title = `${formatTime(remainingTime)} - Таймер`;
}

// --- Сповіщення користувача ---
function notifyUser() {
    if (Notification.permission === "granted") {
        new Notification("Таймер завершився!", { body: `Дія: ${settings.action}` });
    }
}

// --- Запуск таймера ---
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

// --- Пауза ---
function pauseTimer() {
    clearInterval(timerInterval);
}

// --- Скидання ---
function resetTimer() {
    clearInterval(timerInterval);
    remainingTime = parseInt(periodInput.value) || settings.period;
    updateDisplay();
}

// --- Початкове значення ---
remainingTime = settings.period;
periodInput.value = settings.period;
actionSelect.value = settings.action;
updateDisplay();

// --- Автоматичний запуск, якщо вказано action=start або repeat ---
if (settings.action === 'start' || settings.action === 'repeat') {
    startTimer();
}

// --- Обробка подій кнопок ---
startBtn.addEventListener('click', () => {
    settings.period = parseInt(periodInput.value);
    settings.action = actionSelect.value;
    remainingTime = parseInt(periodInput.value);
    startTimer();
});

pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
