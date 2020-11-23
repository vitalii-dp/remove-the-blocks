const grid = Array(288);

//Select DOM elements
const gameField = document.getElementById('game-field');
const scoreElement = document.getElementById('score');
const timer = document.getElementById('timer');
const scoreResult = document.getElementById('score-result');
const nameInput = document.getElementById('name-input');
const tableContent = document.getElementById('table-body');
const startButton = document.getElementById('start-button');
const saveButton = document.getElementById('save-button');
const newGameButton = document.getElementById('new-game-button');
const resetButton = document.getElementById('reset-table-button');

let isGameOver = true;
let score = 0;
let time = 60;
let squares = [];

//Read results from local storage 
let results = JSON.parse(localStorage.getItem('game-results')) || {};

window.addEventListener('load', fillResultsTable);

function fillResultsTable() {
  if (localStorage.getItem('game-results')) {
    for (let prop in results) {
      tableContent.innerHTML += `<tr><td>${prop}</td><td>${results[prop]}</td></tr>`
    }
  } else {
    return;
  }
}

resetButton.addEventListener('click', () => {
  localStorage.removeItem('game-results');
  tableContent.innerHTML = '';
})

//Generate field with blocks
function createGrid() {
  for (let i = 0; i < grid.length; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    gameField.appendChild(square);
    squares.push(square);
  }
}

function fillGrid() {
  for (let i = 0; i < 10; i++) {
    createSquare();
  }
}

function createSquare() {
  const randomIndex = Math.floor(Math.random() * grid.length);
  squares[randomIndex].classList.add('filled-square');
}

function createRandomSquares() {
  const squaresNumber = Math.ceil(Math.random() * 2);
  for (let i = 0; i < squaresNumber; i++) {
    createSquare();
  }
}

gameField.addEventListener('click', (e) => {
  if (e.target.classList.contains('filled-square') && !isGameOver) {
    e.target.classList.remove('filled-square');
    score++;
    scoreElement.innerText = score;
    createRandomSquares();
  };
});

function startGame() {
  isGameOver = false;
  startButton.disabled = true;
  handleTimer();
}

startButton.addEventListener('click', startGame);

//Handle the timer
let gameTimerId;

function handleTimer() {
  updateTimer();
  gameTimerId = setInterval(updateTimer, 1000);

  function updateTimer() {
    if (time <= 0) {
      clearInterval(gameTimerId);
      isGameOver = true;
      showModal();
    }
    timer.textContent = time--;
  }
}

//Reset game field, timer and points
newGameButton.addEventListener('click', resetGame);

function resetGame() {
  score = 0;
  scoreElement.innerText = score;
  time = 60;
  timer.textContent = time;
  startButton.disabled = false;
  clearInterval(gameTimerId);
  clearGrid();
  fillGrid();
}

function clearGrid() {
  squares.forEach(square => square.classList.remove('filled-square'));
}

//Show modal and save results
function showModal() {
  $('.modal').modal('show');
  scoreResult.innerText = score;
}

saveButton.addEventListener('click', saveResults);

function saveResults() {
  const name = nameInput.value || 'Anonymous';
  const tableRow = `<tr><td>${name}</td><td>${score}</td></tr>`;
  tableContent.innerHTML += tableRow;
  results[name] = score;
  localStorage.setItem('game-results', JSON.stringify(results));
}

createGrid();
fillGrid();