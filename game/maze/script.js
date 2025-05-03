const mazeContainer = document.getElementById('maze-container');
const messageElement = document.getElementById('message');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// 可以根據螢幕尺寸動態調整迷宮大小
const gridSize = Math.min(15, Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30));

// 動態生成迷宮地圖 (可以根據 gridSize 調整複雜度)
function generateMazeMap(size) {
    const map = Array(size).fill(null).map(() => Array(size).fill(0));
    let startRow = 1, startCol = 1;
    let endRow = size - 2, endCol = size - 2;
    map[startRow][startCol] = 'S';
    map[endRow][endCol] = 'E';
    for (let i = 0; i < size; i++) {
        map[0][i] = 0;
        map[size - 1][i] = 0;
        map[i][0] = 0;
        map[i][size - 1] = 0;
    }
    for (let i = 1; i < size - 1; i++) {
        map[1][i] = 1;
        map[size - 2][i] = 1;
        map[i][1] = 1;
        map[i][size - 2] = 1;
    }
    map[1][1] = 'S';
    map[size - 2][size - 2] = 'E';
    // 創建一個簡單的路徑
    map[1][2] = 1;
    map[1][3] = 1;
    map[2][3] = 1;
    map[3][3] = 1;
    map[3][2] = 1;
    map[3][1] = 1;
    map[4][1] = 1;
    map[4][2] = 1;
    map[4][3] = 1;
    map[4][4] = 1;
    map[5][4] = 1;
    map[6][4] = 1;
    map[6][3] = 1;
    map[6][2] = 1;
    map[7][2] = 1;
    map[7][3] = 1;
    map[7][4] = 1;
    map[7][5] = 1;
    map[7][6] = 1;
    map[6][6] = 1;
    map[5][6] = 1;
    map[4][6] = 1;
    map[3][6] = 1;
    map[2][6] = 1;
    map[2][7] = 1;
    map[2][8] = 1;
    map[3][8] = 1;
    map[4][8] = 1;
    map[5][8] = 1;
    map[6][8] = 1;
    map[7][8] = 1;
    map[8][8] = 'E';

    return map;
}

const mazeMap = generateMazeMap(gridSize);
let playerRow, playerCol;

function generateMaze() {
    mazeContainer.innerHTML = '';
    mazeContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    mazeContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    mazeMap.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');

            switch (cell) {
                case 0:
                    cellElement.classList.add('wall');
                    break;
                case 1:
                    cellElement.classList.add('path');
                    break;
                case 'S':
                    cellElement.classList.add('start');
                    cellElement.classList.add('player');
                    playerRow = rowIndex;
                    playerCol = colIndex;
                    break;
                case 'E':
                    cellElement.classList.add('end');
                    break;
            }

            mazeContainer.appendChild(cellElement);
        });
    });
}

function movePlayer(direction) {
    let newRow = playerRow;
    let newCol = playerCol;

    switch (direction) {
        case 'up':
            newRow--;
            break;
        case 'down':
            newRow++;
            break;
        case 'left':
            newCol--;
            break;
        case 'right':
            newCol++;
            break;
    }

    if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize &&
        mazeMap[newRow][newCol] !== 0
    ) {
        const oldPlayerCell = mazeContainer.children[playerRow * gridSize + playerCol];
        oldPlayerCell.classList.remove('player');

        playerRow = newRow;
        playerCol = newCol;

        const newPlayerCell = mazeContainer.children[playerRow * gridSize + playerCol];
        newPlayerCell.classList.add('player');

        if (mazeMap[playerRow][playerCol] === 'E') {
            messageElement.textContent = '恭喜你到達終點！';
        } else {
            messageElement.textContent = '';
        }
    }
}

// 添加觸控事件監聽器
upBtn.addEventListener('click', () => movePlayer('up'));
downBtn.addEventListener('click', () => movePlayer('down'));
leftBtn.addEventListener('click', () => movePlayer('left'));
rightBtn.addEventListener('click', () => movePlayer('right'));

// 遊戲初始化
generateMaze();

// 可以根據螢幕尺寸重新生成迷宮 (可選)
window.addEventListener('resize', generateMaze);
