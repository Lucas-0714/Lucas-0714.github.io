const mapSelect = document.getElementById('map-select');
const startButton = document.getElementById('start-button');
const mazeContainer = document.getElementById('maze-container');
const messageElement = document.getElementById('message');
const controlsElement = document.getElementById('controls');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let mazeMap = [];
let gridSize = 0;
let playerRow, playerCol;

// 定義不同的迷宮地圖
const maps = {
    map1: [
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
    ],
    map2: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'S', 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 'E', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    map3: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'S', 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 'E', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
};

function generateMaze(selectedMap) {
    mazeContainer.innerHTML = '';
    mazeMap = maps[selectedMap];
    gridSize = mazeMap.length;
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

// 開始遊戲的事件監聽器
startButton.addEventListener('click', () => {
    const selectedMap = mapSelect.value;
    generateMaze(selectedMap);
    document.getElementById('map-selector').style.display = 'none';
    mazeContainer.style.display = 'grid';
    controlsElement.style.display = 'flex';
});

// 初始時不生成迷宮
function generateMaze(selectedMap) {
    console.log('generateMaze 函數被調用，選中的地圖是：', selectedMap);
    mazeContainer.innerHTML = '';
    mazeMap = maps[selectedMap];
    console.log('載入的地圖資料：', mazeMap);
    if (!mazeMap) {
        console.error('找不到選定的地圖！');
        return;
    }
    gridSize = mazeMap.length;
    console.log('迷宮尺寸：', gridSize);
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
    console.log('迷宮生成完成');
}
