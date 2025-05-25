const gameContainer = document.getElementById('game-container');
const messageElement = document.getElementById('message');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const deadlockSound = document.getElementById('deadlockSound');
const bgSound = document.getElementById('bgSound');
const startMenu = document.getElementById('start-menu');
const gameWrapper = document.getElementById('game-wrapper');
const startGameBtn = document.getElementById('startGameBtn');
const loadGameBtnMenu = document.getElementById('loadGameBtn');

let currentLevel = 0;
const levels = [
    [
        "#####",
        "#@  #",
        "# $ #",
        "# . #",
        "#####"
    ],
    [
        "  #####  ",
        "###   ###",
        "#.$ @ $.#",
        "###   ###",
        "#.$   $.#",
        "###   ###",
        "#.$   $.#",
        "###   ###",
        "  #####  "
    ],
    [
        "########",
        "##@    #",
        "#### $##",
        "####   #",
        "#### $ #",
        "####  ##",
        "####..##",
        "########"
    ],
    [
        "### ### ### ### ### ## ",
        "#    #  # # #   #    # ",
        "###  #  ### # # ###  # ",
        "  #  #  # # # # #    # ",
        "###  #  # # ### ### ###",
        "                       ",
        "         #####         ",
        "         #@$.#         ",
        "         #####         ",
        "                       "
    ],
    [
        "#   ### # # ### #   ## ",
        "#   #   # # #   #    # ",
        "#   ### # # ### #    # ",
        "#   #   # # #   #    # ",
        "### ###  #  ### ### ###",
        "                       ",
        "         #####         ",
        "         #@$.#         ",
        "         #####         ",
        "                       "
    ],
    [
        "##### ",
        "#@  ##",
        "#.$* #",
        "#  # #",
        "#    #",
        "######"
    ],
    [
        "### ### ### ### ### ###",
        "#    #  # # #   #     #",
        "###  #  ### # # ### ###",
        "  #  #  # # # # #   #  ",
        "###  #  # # ### ### ###",
        "                       ",
        "         #####         ",
        "         #@$.#         ",
        "         #####         ",
        "                       "
    ],
    [
        "    #####             ",
        "    #$  #             ",
        "    #   #             ",
        "  ###  $##            ",
        "  #  $ $ #            ",
        "### # ## #   #########",
        "#   # ## #####     ..#",
        "# $  $             ..#",
        "##### ### #@##     ..#",
        "    #     ############",
        "    #######           "
    ],
    [
        " #####        ",
        "############  ",
        "#..  #     ###",
        "#..  # $  $  #",
        "#..  #$####  #",
        "#..    @ ##  #",
        "#..  # #  $ ##",
        "###### ##$ $ #",
        "  # $  $ $ $ #",
        "  #    #     #",
        "  ############"
    ],
    [
        "### ### ### ### ### ###",
        "#    #  # # #   #     #",
        "###  #  ### # # ### ###",
        "  #  #  # # # # #     #",
        "###  #  # # ### ### ###",
        "                       ",
        "         #####         ",
        "         #@$.#         ",
        "         #####         ",
        "                       "
    ],
    // ... 更多關卡
];
let map;
let playerPos;
let boxesPos = [];
let targetsPos = [];
let levelCompleted = false;
let boxesOnTarget = 0;

function loadLevel() {
    levelCompleted = false;
    messageElement.textContent = ''; // 在載入新關卡時清除訊息
    if (currentLevel >= levels.length) {
        messageElement.textContent = '所有關卡已完成！';
        return;
    }
    map = levels[currentLevel].map(row => row.split(''));
    playerPos = findChar('@');
    boxesPos = findAllChar('$');
    targetsPos = findAllChar('.');
    boxesOnTarget = findAllChar('*').length;
    renderMap();
}

function findChar(char) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === char) {
                return { x, y };
            }
        }
    }
    return null;
}

function findAllChar(char) {
    const positions = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === char) {
                positions.push({ x, y });
            }
        }
    }
    return positions;
}

function renderMap() {
    gameContainer.innerHTML = '';
    if (!map || map.length === 0 || map[0].length === 0) {
        console.error("地圖資料無效！");
        return;
    }

    const numCols = map[0].length;
    const numRows = map.length;
    const gameWrapperElement = document.getElementById('game-wrapper');
    const wrapperWidth = gameWrapperElement.offsetWidth > 0 ? gameWrapperElement.offsetWidth : window.innerWidth * 0.95; // 取得 game-wrapper 的寬度，或使用視窗寬度的 95% 作為預設
    const wrapperHeight = gameWrapperElement.offsetHeight > 0 ? gameWrapperElement.offsetHeight : window.innerHeight * 0.6; // 取得 game-wrapper 的高度，或使用視窗高度的 60% 作為預設

    // 計算 cell 的大小，目標是盡可能填滿 wrapper，同時保持是正方形
    const cellWidth = Math.min(wrapperWidth / numCols, wrapperHeight / numRows);
    const cellSize = Math.floor(cellWidth * 0.98); // 稍微縮小一點，留一些間距

    gameContainer.style.gridTemplateColumns = `repeat(${numCols}, ${cellSize}px)`;
    gameContainer.style.gridTemplateRows = `repeat(${numRows}, ${cellSize}px)`;
    gameContainer.style.gap = '0px'; // 可以調整 cell 之間的間距

    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.fontSize = `${Math.floor(cellSize * 0.6)}px`; // 根據 cell 大小調整字體大小
            switch (map[y][x]) {
                case '#':
                    cell.classList.add('wall');
                    break;
                case ' ':
                    cell.classList.add('empty');
                    break;
                case '$':
                    cell.classList.add('box');
                    break;
                case '.':
                    cell.classList.add('target');
                    break;
                case '@':
                    cell.classList.add('player');
                    break;
                case '*':
                    cell.classList.add('box', 'on-target');
                    break;
                case '+':
                    cell.classList.add('player', 'on-target');
                    break;
            }
            gameContainer.appendChild(cell);
        }
    }
}

function isTarget(x, y) {
    return targetsPos.some(t => t.x === x && t.y === y);
}

function isDeadlock() {
    for (const box of boxesPos) {
        const { x, y } = box;
        const isBlocked =
            isObstacle(x + 1, y) && isObstacle(x - 1, y) &&
            isObstacle(x, y + 1) && isObstacle(x, y - 1);
        if (isBlocked && !isTarget(x, y)) {
            return true;
        }
    }
    return false;
}

function isObstacle(x, y) {
    if (y < 0 || y >= map.length || x < 0 || x >= map[y].length || map[y][x] === '#') {
        return true;
    }
    return boxesPos.some(b => b.x === x && b.y === y);
}

function movePlayer(dx, dy) {
    if (!playerPos) return;
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newY >= 0 && newY < map.length && newX >= 0 && newX < map[newY].length) {
        const targetCell = map[newY][newX];

        if (targetCell === ' ' || targetCell === '.') {
            updatePlayerPosition(newX, newY);
        } else if (targetCell === '$' || targetCell === '*') {
            const boxNewX = newX + dx;
            const boxNewY = newY + dy;

            if (boxNewY >= 0 && boxNewY < map.length && boxNewX >= 0 && boxNewX < map[boxNewY].length) {
                const nextCell = map[boxNewY][boxNewX];
                if (nextCell === ' ' || nextCell === '.') {
                    moveBox(newX, newY, boxNewX, boxNewY);
                    updatePlayerPosition(newX, newY);
                }
            }
        }
    }
}

function updatePlayerPosition(newX, newY) {
    map[playerPos.y][playerPos.x] = (map[playerPos.y][playerPos.x] === '+') ? '.' : ' ';
    playerPos.x = newX;
    playerPos.y = newY;
    map[playerPos.y][playerPos.x] = (map[playerPos.y][playerPos.x] === '.') ? '+' : '@';
    renderMap();
    if (isDeadlock()) {
        deadlockSound.play();
        messageElement.textContent = '檢測到死局！';
    }
    checkWin();
}

function moveBox(oldX, oldY, newX, newY) {
    map[oldY][oldX] = (map[oldY][oldX] === '*') ? '.' : ' ';
    map[newY][newX] = (map[newY][newX] === '.') ? '*' : '$';
    renderMap();
    if (isDeadlock()) {
        deadlockSound.play();
        messageElement.textContent = '檢測到死局！';
    }
    checkWin();
}

function checkWin() {
    const boxesOnTargets = findAllChar('*').length;
    const totalTargets = targetsPos.length + boxesOnTarget;

    if (boxesOnTargets === totalTargets && !levelCompleted) {
        messageElement.textContent = '恭喜過關！';
        winSound.play();
        levelCompleted = true;
        setTimeout(() => {
            currentLevel++;
            loadLevel();
        }, 1500);
    }
}

function saveGame() {
    const gameState = {
        currentLevel: currentLevel,
        map: map,
        playerPos: playerPos,
        boxesPos: boxesPos
    };
    localStorage.setItem('sokobanGame', JSON.stringify(gameState));
    messageElement.textContent = '遊戲已儲存！';
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1500);
}

function loadGame() {
    const savedGame = localStorage.getItem('sokobanGame');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        currentLevel = gameState.currentLevel;
        map = gameState.map;
        playerPos = gameState.playerPos;
        boxesPos = gameState.boxesPos;
        targetsPos = findAllChar('.');
        renderMap(); // 在載入數據後立即渲染地圖
        startMenu.style.display = 'none';
        gameWrapper.style.display = 'flex';
        playBackgroundMusic();
        messageElement.textContent = '遊戲已載入！';
    } else {
        messageElement.textContent = '沒有儲存的遊戲！';
    }
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1500);
}

function restartLevel() {
    loadLevel();
    messageElement.textContent = '關卡已重新開始！';
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1500);
}

function playBackgroundMusic() {
    bgSound.loop = true;
    bgSound.volume = 0.5;
    bgSound.play().catch(error => {
        console.error("播放背景音樂失敗:", error);
    });
}

function startGame() {
    startMenu.style.display = 'none';
    gameWrapper.style.display = 'flex';
    currentLevel = 0;
    loadLevel();
    playBackgroundMusic();
}

// 事件監聽
upBtn.addEventListener('click', () => movePlayer(0, -1));
downBtn.addEventListener('click', () => movePlayer(0, 1));
leftBtn.addEventListener('click', () => movePlayer(-1, 0));
rightBtn.addEventListener('click', () => movePlayer(1, 0));
loadBtn.addEventListener('click', loadGame);
restartBtn.addEventListener('click', restartLevel);
saveBtn.addEventListener('click', saveGame);
startGameBtn.addEventListener('click', startGame);
loadGameBtnMenu.addEventListener('click', loadGame); // 載入遊戲按鈕也直接調用 loadGame

window.onload = () => {
    if (localStorage.getItem('sokobanGame')) {
        loadGameBtnMenu.textContent = '載入遊戲';
        loadGameBtnMenu.disabled = false;
    } else {
        loadGameBtnMenu.textContent = '沒有儲存的遊戲';
        loadGameBtnMenu.disabled = true;
    }
};
