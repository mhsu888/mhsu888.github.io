const guessForm = document.querySelector('form');
const guessMessage = document.getElementById('guess-message');
let secretNumber = Math.floor(100 * Math.random()) + 1;
console.log(`The secret number is ${secretNumber}`);
let score = 10;
let highScore = 0;
const guessHistory = document.getElementById('guess-history');
const guessHistoryList = document.getElementById('guess-history-list');
let guessHistoryArray = [];

const playDiv = document.querySelector('div.play');
const winDiv = document.querySelector('div.win');
const loseDiv = document.querySelector('div.lose');

const resetButton = document.getElementById('reset');

function updateScore(newScore) {
    score = newScore;
    document.querySelectorAll('span.score').forEach((span) => {
        span.textContent = score;
    });
}

function updateHighScore(newScore) {
    highScore = newScore;
    document.querySelectorAll('span.high-score').forEach((span) => {
        span.textContent = highScore;
    });
}

function revealSecretNumber() {
    document.querySelectorAll('span.secret-number').forEach((span) => {
        span.textContent = secretNumber;
    });
}

function showMessage(message) {
    guessMessage.textContent = message;
}

function addGuessToHistory(guess) {
    const li = document.createElement('li');
    li.textContent = guess;
    guessHistoryList.appendChild(li);
    guessHistoryArray.push(guess);
}

function clearGuessHistory() {
    while (guessHistoryList.firstChild) {
        guessHistoryList.removeChild(guessHistoryList.firstChild);
    }
    guessHistoryArray = [];
}

function gameOver() {
    loseDiv.style.display = 'block';
    playDiv.style.display = 'none';
    resetButton.style.display = 'none';
}

function win() {
    winDiv.style.display = 'block';
    playDiv.style.display = 'none';
    resetButton.style.display = 'none';
}

function restart() {
    secretNumber = Math.floor(100 * Math.random()) + 1;
    console.log(`The secret number is ${secretNumber}`);
    updateScore(10);
    clearGuessHistory();
    showMessage('');
    guessForm.reset();
    winDiv.style.display = 'none';
    loseDiv.style.display = 'none';
    playDiv.style.display = 'block';
    resetButton.style.display = 'inline-block';
}

guessForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = Number(new FormData(event.target).get('guess'));
    if (guessHistoryArray.includes(guess)) {
        showMessage('You already guessed this number!');
        return;
    }


    if (guess === secretNumber) {
        if (score > highScore) {
            updateHighScore(score);
        }
        revealSecretNumber();
        win();
    }
    else {
        addGuessToHistory(guess);
        updateScore(score - 1);
        if (score < 1) {
            revealSecretNumber();
            gameOver();
        }
        else if (guess > secretNumber) {
            showMessage('Too high');
        }
        else if (guess < secretNumber) {
            showMessage('Too low');
        }
    }
    event.target.reset();
});

document.querySelectorAll('button.restart').forEach((button) => {
    button.addEventListener('click', function () {
        restart();
    });
});