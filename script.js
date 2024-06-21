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
            <div id="total-${i}" class="total">Total = 0 Kyats</div>
            <button class="play" onclick="startTimer(${i})">Play</button>
            <button class="pause" onclick="pauseTimer(${i})">Pause</button>
            <button class="reset" onclick="resetTimer(${i})">Reset</button>
        `;
        tablesContainer.appendChild(table);
    }
});

const timers = {};
const intervals = {};

function startTimer(tableId) {
    if (!timers[tableId]) {
        timers[tableId] = 0;
    }
    if (intervals[tableId]) {
        clearInterval(intervals[tableId]);
    }
    intervals[tableId] = setInterval(() => {
        timers[tableId]++;
        document.getElementById(`timer-${tableId}`).innerText = formatTime(timers[tableId]);
        
        // Update total every 600 seconds (10 minutes)
        if (timers[tableId] % 600 === 0) {
            updateTotal(tableId);
        }
    }, 1000);
}

function pauseTimer(tableId) {
    clearInterval(intervals[tableId]);
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
    timers[tableId] = 0; // Reset timer count to 0
    document.getElementById(`timer-${tableId}`).innerText = formatTime(0); // Update the timer display
    updateTotal(tableId, true); // Reset total cost
}

function updateTotal(tableId) {
    const ratePerHour = 4000;
    const hours = timers[tableId] / 3600; // Total hours elapsed
    const total = Math.ceil(hours * 6) / 6 * ratePerHour; // Rounds to the nearest 10 minutes for billing
    document.getElementById(`total-${tableId}`).innerText = `Total = ${total.toFixed(0)} Kyats`;
}
