document.addEventListener("DOMContentLoaded", function () {
    let rows = 2;  // Initial grid rows
    let cols = 3;  // Initial grid columns
    let gameBoard = [];
    let generationCount = 0;
    let livingCellsCount = 0;
    let isPaused = true;

    const gameBoardElement = document.getElementById("game-board");
    const generationCountElement = document.getElementById("generation-count");
    const livingCellsCountElement = document.getElementById("living-cells-count");
    const rowsInputElement = document.getElementById("rows-input");
    const colsInputElement = document.getElementById("cols-input");
    const applySettingsButton = document.getElementById("apply-settings");

    // Update HUD with grid size
    function updateGridSizeDisplay() {
        document.getElementById("grid-size").textContent = `${rows} x ${cols}`;
    }

    // Apply new settings for grid size
    applySettingsButton.addEventListener("click", function () {
        rows = parseInt(rowsInputElement.value);
        cols = parseInt(colsInputElement.value);
        createGrid();
        updateGridSizeDisplay();
    });

    // Create the game grid dynamically based on rows and columns
    function createGrid() {
        gameBoardElement.innerHTML = "";  // Clear previous grid

        // Set cell size in fixed pixels
        const cellSize = "40px";  // Fixed cell size

        gameBoardElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize})`;
        gameBoardElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize})`;

        gameBoard = [];

        for (let row = 0; row < rows; row++) {
            let rowArray = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.style.width = cellSize;
                cell.style.height = cellSize;

                // Toggle cell state on click
                cell.addEventListener("click", function () {
                    cell.classList.toggle("alive");
                    updateLivingCellsCount();
                });

                gameBoardElement.appendChild(cell);
                rowArray.push(cell);
            }
            gameBoard.push(rowArray);
        }
    }

    // Update living cell count
    function updateLivingCellsCount() {
        livingCellsCount = 0;
        for (let row of gameBoard) {
            for (let cell of row) {
                if (cell.classList.contains("alive")) {
                    livingCellsCount++;
                }
            }
        }
        livingCellsCountElement.textContent = livingCellsCount;
    }

    // Play button handler
    document.getElementById("play-button").addEventListener("click", function () {
        if (isPaused) {
            isPaused = false;
            runGame();
        }
    });

    // Pause button handler
    document.getElementById("pause-button").addEventListener("click", function () {
        isPaused = true;
    });

    // Clear button handler
    document.getElementById("clear-button").addEventListener("click", function () {
        for (let row of gameBoard) {
            for (let cell of row) {
                cell.classList.remove("alive");
            }
        }
        generationCount = 0;
        livingCellsCount = 0;
        generationCountElement.textContent = generationCount;
        livingCellsCountElement.textContent = livingCellsCount;
    });

    // Next generation button handler
    document.getElementById("next-button").addEventListener("click", function () {
        nextGeneration();
    });

    // Run the game loop
    function runGame() {
        if (!isPaused) {
            nextGeneration();
            setTimeout(runGame, 500); // Run next generation every 500ms
        }
    }

    // Calculate next generation using Conway's rules
    function nextGeneration() {
        const newBoardState = [];

        for (let row = 0; row < rows; row++) {
            const newRow = [];
            for (let col = 0; col < cols; col++) {
                const cell = gameBoard[row][col];
                const aliveNeighbors = countAliveNeighbors(row, col);

                if (cell.classList.contains("alive")) {
                    if (aliveNeighbors === 2 || aliveNeighbors === 3) {
                        newRow.push(true);
                    } else {
                        newRow.push(false);
                    }
                } else {
                    if (aliveNeighbors === 3) {
                        newRow.push(true);
                    } else {
                        newRow.push(false);
                    }
                }
            }
            newBoardState.push(newRow);
        }

        // Update grid to reflect new state
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newBoardState[row][col]) {
                    gameBoard[row][col].classList.add("alive");
                } else {
                    gameBoard[row][col].classList.remove("alive");
                }
            }
        }

        generationCount++;
        generationCountElement.textContent = generationCount;
        updateLivingCellsCount();
    }

    // Count live neighbors of a cell
    function countAliveNeighbors(row, col) {
        let count = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                const neighborRow = row + i;
                const neighborCol = col + j;

                if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                    if (gameBoard[neighborRow][neighborCol].classList.contains("alive")) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    // Initialize grid
    createGrid();
    updateGridSizeDisplay();
});
