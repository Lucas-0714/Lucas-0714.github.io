const mazeContainer = document.getElementById('maze-container');
const messageElement = document.getElementById('message');

// 定義迷宮地圖 (0: 牆壁, 1: 路徑, S: 起點, E: 終點)
const mazeMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 'S', 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 'E', 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let playerRow, playerCol;
const gridSize = mazeMap.length;

// 根據迷宮地圖生成 HTML
function generateMaze() {
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

// 處理玩家移動
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
        // 移除玩家之前的樣式
        const oldPlayerCell = mazeContainer.children[playerRow * gridSize + playerCol];
        oldPlayerCell.classList.remove('player');

        playerRow = newRow;
        playerCol = newCol;

        // 更新玩家的新位置
        const newPlayerCell = mazeContainer.children[playerRow * gridSize + playerCol];
        newPlayerCell.classList.add('player');

        // 檢查是否到達終點
        if (mazeMap[playerRow][playerCol] === 'E') {
            messageElement.textContent = '恭喜你到達終點！';
            // 可以添加更多遊戲結束邏輯
        } else {
            messageElement.textContent = ''; // 清空訊息
        }
    }
}

// 監聽鍵盤事件
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
    }
});

// 遊戲初始化
generateMaze();
