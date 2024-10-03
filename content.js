let liveCellColor = '#000000';
let deadCellColor = '#FFFFFF';
let backgroundColor = '#F0F0F0';
let isRunning = false;
let gameBoard = createEmptyBoard(50);
let timer;

// Canvas setup
const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
drawBoard();

// Event listener for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case 'play':
            if (!isRunning) {
                timer = setInterval(nextGeneration, 200);
                isRunning = true;
            }
            break;
        case 'pause':
            clearInterval(timer);
            isRunning = false;
            break;
        case 'next':
            nextGeneration();
            break;
        case 'clear':
            gameBoard = createEmptyBoard(50);
            drawBoard();
            break;
        case 'reset':
            resetSettings();
            break;
        case 'updateLiveCellColor':
            liveCellColor = message.value;
            drawBoard();
            break;
        case 'updateDeadCellColor':
            deadCellColor = message.value;
            drawBoard();
            break;
        case 'updateBackgroundColor':
            backgroundColor = message.value;
            drawBoard();
            break;
    }
});

function createEmptyBoard(size) {
    const board = [];
    for (let row = 0; row < size; row++) {
        board[row] = [];
        for (let col = 0; col < size; col++) {
            board[row][col] = false;
        }
    }
    return board;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < 50; row++) {
        for (let col = 0; col < 50; col++) {
            if (gameBoard[row][col]) {
                ctx.fillStyle = liveCellColor;
                ctx.fillRect(col * 10, row * 10, 10, 10);
            } else {
                ctx.fillStyle = deadCellColor;
                ctx.fillRect(col * 10, row * 10, 10, 10);
            }
        }
    }
}

function nextGeneration() {
    const newBoard = createEmptyBoard(50);
    for (let row = 0; row < 50; row++) {
        for (let col = 0; col < 50; col++) {
            const neighbors = countLivingNeighbors(row, col);
            const isAlive = gameBoard[row][col];
            if (isAlive && (neighbors === 2 || neighbors === 3)) {
                newBoard[row][col] = true;
            } else if (!isAlive && neighbors === 3) {
                newBoard[row][col] = true;
            } else {
                newBoard[row][col] = false;
            }
        }
    }
    gameBoard = newBoard;
    drawBoard();
}

function countLivingNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = (row + i + 50) % 50;
            const newCol = (col + j + 50) % 50;
            if (gameBoard[newRow][newCol]) count++;
        }
    }
    return count;
}

function resetSettings() {
    liveCellColor = '#000000';
    deadCellColor = '#FFFFFF';
    backgroundColor = '#F0F0F0';
    drawBoard();
}
