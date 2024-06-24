// Combined script.js and time.js content
document.addEventListener('DOMContentLoaded', () => {
    const tablesContainer = document.getElementById('tables-container');
    const tablesCount = 12;

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

function resetTimer(tableId) {
    clearInterval(intervals[tableId]);
    timers[tableId] = 0;
    saveTimerState(tableId, 0, 'reset');
    document.getElementById(`timer-${tableId}`).innerText = formatTime(0);
    updateTotal(tableId, true); // Call with reset flag true
}

function stopAllTimers() {
    for (const tableId in intervals) {
        if (intervals.hasOwnProperty(tableId)) {
            clearInterval(intervals[tableId]);
            saveTimerState(tableId, timers[tableId], 'paused');
        }
    }
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

function updateTotal(tableId, reset = false) {
    const ratePerHour = 20;
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

$(function () {
    // Cache some selectors
    var clock = $('#clock'),
        alarm = clock.find('.alarm'),
        ampm = clock.find('.ampm');

    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    // This object will hold the digit elements
    var digits = {};

    // Positions for the hours, minutes, and seconds
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    // Generate the digits with the needed markup,
    // and add them to the clock
    var digit_holder = clock.find('.digits');

    $.each(positions, function () {
        if (this == ':') {
            digit_holder.append('<div class="dots">');
        } else {
            var pos = $('<div>');
            for (var i = 1; i < 8; i++) {
                pos.append('<span class="d' + i + '">');
            }
            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;
            // Add the digit elements to the page
            digit_holder.append(pos);
        }
    });

    // Add the weekday names
    var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
        weekday_holder = clock.find('.weekdays');

    $.each(weekday_names, function () {
        weekday_holder.append('<span>' + this + '</span>');
    });

    var weekdays = clock.find('.weekdays span');

    // Run a timer every second and update the clock
    (function update_time() {
        var now = moment().format("hhmmssdA");
        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);

        var dow = now[6];
        dow--;
        if (dow < 0) {
            dow = 6;
        }
        weekdays.removeClass('active').eq(dow).addClass('active');
        ampm.text(now[7] + now[8]);

        setTimeout(update_time, 1000);
    })();

    $('a.button').click(function () {
        clock.toggleClass('light dark');
    });
});