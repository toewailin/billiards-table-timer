document.addEventListener('DOMContentLoaded', () => {
    const tablesContainer = document.getElementById('tables-container');
    const tablesCount = 20;

    for (let i = 1; i <= tablesCount; i++) {
        const table = document.createElement('div');
        table.className = 'table';
        table.id = `table-${i}`;
        table.innerHTML = `
            <h2>Table ${i}</h2>
            <div class="timer" id="timer-${i}">00:00:00</div>
            <div id="total-${i}" class="total">Total = ${localStorage.getItem(`total-${i}`) || 0} Kyats</div>
            <button class="play" onclick="startTimer(${i})">Play</button>
            <button class="pause" onclick="pauseTimer(${i})">Pause</button>
            <button class="reset" onclick="resetTimer(${i})">Reset</button>
        `;
        tablesContainer.appendChild(table);

        const savedData = loadTimerState(i);
        if (savedData) {
            timers[i] = savedData.seconds;
            document.getElementById(`timer-${i}`).innerText = formatTime(savedData.seconds);
            if (savedData.state === 'running') {
                startTimer(i);
            } else {
                updateTotal(i); // Ensure total is updated based on loaded time
            }
        }
    }
});

const timers = {};
const intervals = {};

function startTimer(tableId) {
    if (!timers[tableId]) {
        timers[tableId] = loadTimerState(tableId) || 0;
    }
    saveTimerState(tableId, timers[tableId], 'running');
    if (intervals[tableId]) {
        clearInterval(intervals[tableId]);
    }
    intervals[tableId] = setInterval(() => {
        timers[tableId]++;
        saveTimerState(tableId, timers[tableId], 'running');
        document.getElementById(`timer-${tableId}`).innerText = formatTime(timers[tableId]);
        if (timers[tableId] % 600 === 0) {
            updateTotal(tableId);
        }
    }, 1000);
}

function pauseTimer(tableId) {
    clearInterval(intervals[tableId]);
    saveTimerState(tableId, timers[tableId], 'paused');
}


function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

function resetTimer(tableId) {
    clearInterval(intervals[tableId]);
    timers[tableId] = 0;
    saveTimerState(tableId, 0, 'reset');
    document.getElementById(`timer-${tableId}`).innerText = formatTime(0);
    updateTotal(tableId, true); // Call with reset flag true
}


function updateTotal(tableId, reset = false) {
    const ratePerHour = 4000;
    const hours = timers[tableId] / 3600;
    const total = reset ? 0 : Math.ceil(hours * 6) / 6 * ratePerHour;
    document.getElementById(`total-${tableId}`).innerText = `Total = ${total.toFixed(0)} Kyats`;
    localStorage.setItem(`total-${tableId}`, total.toFixed(0)); // Save total to localStorage
}

function saveTimerState(tableId, seconds, state) {
    const timerData = { seconds: seconds, state: state };
    localStorage.setItem(`timer-${tableId}`, JSON.stringify(timerData));
}

function loadTimerState(tableId) {
    const data = localStorage.getItem(`timer-${tableId}`);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}
