const gameContainer = document.getElementById('game-container');
const messageElement = document.getElementById('message');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

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
        "         #####     #   ",
        "         #@$.#   ####  ",
        "         #####     #   ",
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
        "### ### ### ### ### ###",
        "#    #  # # #   #     #",
        "###  #  ### # # ### ###",
        "  #  #  # # # # #   #  ",
        "###  #  # # ### ### ###",
        "                       ",
        "         #####     #   ",
        "         #@$.#   ####  ",
        "         #####     #   ",
        "                       "
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
        "         #####     #   ",
        "         #@$.#   ####  ",
        "         #####     #   ",
        "                       "
    ],
    // ... 更多關卡
];
let map;
let playerPos;
let boxesPos = [];
let targetsPos = [];

function loadLevel() {
    if (currentLevel >= levels.length) {
        messageElement.textContent = '所有關卡已完成！';
        return;
    }
    map = levels[currentLevel].map(row => row.split(''));
    playerPos = findChar('@');
    boxesPos = findAllChar('$');
    targetsPos = findAllChar('.');
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
    const gridSize = Math.min(window.innerWidth * 0.8 / map[0].length, window.innerHeight * 0.6 / map.length);
    gameContainer.style.gridTemplateColumns = `repeat(${map[0].length}, ${gridSize}px)`;
    gameContainer.style.gridTemplateRows = `repeat(${map.length}, ${gridSize}px)`;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
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
    checkWin();
}

function moveBox(oldX, oldY, newX, newY) {
    map[oldY][oldX] = (map[oldY][oldX] === '*') ? '.' : ' ';
    map[newY][newX] = (map[newY][newX] === '.') ? '*' : '$';
}

function checkWin() {
    const allBoxesOnTargets = findAllChar('$').length === 0;
    if (allBoxesOnTargets) {
        messageElement.textContent = '恭喜過關！';
        setTimeout(() => {
            currentLevel++;
            loadLevel();
        }, 1500);
    } else {
        messageElement.textContent = '';
    }
}

// 事件監聽
upBtn.addEventListener('click', () => movePlayer(0, -1));
downBtn.addEventListener('click', () => movePlayer(0, 1));
leftBtn.addEventListener('click', () => movePlayer(-1, 0));
rightBtn.addEventListener('click', () => movePlayer(1, 0));

const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const restartBtn = document.getElementById('restartBtn');

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
        renderMap();
        messageElement.textContent = '遊戲已載入！';
    } else {
        messageElement.textContent = '沒有儲存的遊戲！';
    }
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1500);
}

function restartLevel() {
    loadLevel(); // 重新載入當前關卡
    messageElement.textContent = '關卡已重新開始！';
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1500);
}

// 事件監聽器
saveBtn.addEventListener('click', saveGame);
loadBtn.addEventListener('click', loadGame);
restartBtn.addEventListener('click', restartLevel);

// 檢查是否有儲存的遊戲，並提供載入選項 (可選)
window.onload = () => {
    if (localStorage.getItem('sokobanGame')) {
        messageElement.textContent = '發現儲存的遊戲，點擊 "載入遊戲" 繼續。';
        setTimeout(() => {
            messageElement.textContent = '';
        }, 3000);
    }
};

// 載入第一關
loadLevel();
