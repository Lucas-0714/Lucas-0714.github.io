const gridContainer = document.getElementById('grid-container');
const messageElement = document.getElementById('message');
const newGameButton = document.getElementById('new-game');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const minesInput = document.getElementById('mines');

let grid = [];
let numRows;
let numCols;
let numMines;
let revealedCount = 0;
let flaggedCount = 0;
let gameStarted = false;

newGameButton.addEventListener('click', startGame);

function startGame() {
    numRows = parseInt(rowsInput.value);
    numCols = parseInt(colsInput.value);
    numMines = parseInt(minesInput.value);
    if (numMines >= numRows * numCols) {
        alert("地雷數不能大於或等於總單元格數！");
        return;
    }
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    grid = createGrid(numRows, numCols);
    placeMines(grid, numMines);
    renderGrid(grid);
    messageElement.textContent = '';
    revealedCount = 0;
    flaggedCount = 0;
    gameStarted = true;
}

function createGrid(rows, cols) {
    return Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            row,
            col,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
            element: null,
        }))
    );
}

function placeMines(grid, mines) {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * grid.length);
        const col = Math.floor(Math.random() * grid[0].length);
        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minesPlaced++;
        }
    }
    calculateAdjacentMines(grid);
}

function calculateAdjacentMines(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (!grid[i][j].isMine) {
                grid[i][j].adjacentMines = getAdjacentCells(grid, i, j)
                    .filter(cell => cell.isMine)
                    .length;
            }
        }
    }
}

function renderGrid(grid) {
    grid.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cell.element = cellElement;
            cellElement.addEventListener('click', () => handleCellClick(cell));
            cellElement.addEventListener('contextmenu', (e) => handleRightClick(e, cell));
            gridContainer.appendChild(cellElement);
        });
    });
}

function handleCellClick(cell) {
    if (!gameStarted || cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    revealedCount++;
    cell.element.classList.add('revealed');

    if (cell.isMine) {
        revealAllMines();
        messageElement.textContent = '你踩到地雷了！遊戲結束。';
        gameStarted = false;
    } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
    } else {
        revealAdjacentEmptyCells(grid, cell.row, cell.col);
    }

    checkWin();
}

function handleRightClick(e, cell) {
    e.preventDefault();
    if (!gameStarted || cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    cell.element.classList.toggle('flagged');
    cell.element.textContent = cell.isFlagged ? '🚩' : '';

    flaggedCount += cell.isFlagged ? 1 : -1;
}

function revealAdjacentEmptyCells(grid, row, col) {
    const adjacent = getAdjacentCells(grid, row, col);
    adjacent.forEach(adjCell => {
        if (!adjCell.isMine && !adjCell.isRevealed && !adjCell.isFlagged) {
            handleCellClick(adjCell);
        }
    });
}

function getAdjacentCells(grid, row, col) {
    const adjacentCells = [];
    for (let i = Math.max(0, row - 1); i <= Math.min(grid.length - 1, row + 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(grid[0].length - 1, col + 1); j++) {
            if (i !== row || j !== col) {
                adjacentCells.push(grid[i][j]);
            }
        }
    }
    return adjacentCells;
}

function revealAllMines() {
    grid.forEach(row => {
        row.forEach(cell => {
            if (cell.isMine) {
                cell.isRevealed = true;
                cell.element.classList.add('revealed', 'mine');
                cell.element.textContent = '💣';
            }
        });
    });
}

function checkWin() {
    const totalNonMines = numRows * numCols - numMines;
    if (revealedCount === totalNonMines) {
        messageElement.textContent = '恭喜你贏了！';
        gameStarted = false;
        revealAllMines(); // 可選：在贏的時候也顯示所有地雷
    }
}

// 初始載入遊戲
startGame();
