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
    "#######",
    "#@    #",
    "### $##",
    "#.#   #",
    "# # $ #",
    "#    ##",
    "#######"
  ],
  [
    "  #####  ",
    "###   ###",
    "# $ @ $ #",
    "###   ###",
    "  #####  "
  ],
  // ... 更多關卡
];
let map;
let playerPos;
let boxesPos = [];
let targetsPos = [];

function loadLevel() {
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
  const gridSize = Math.min(window.innerWidth, window.innerHeight) / map[0].length;
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
    currentLevel++; // 增加關卡索引
    if (currentLevel < levels.length) {
      setTimeout(loadLevel, 1500); // 延遲 1.5 秒後載入下一關
    } else {
      messageElement.textContent = '所有關卡已完成！';
      // 可以顯示重新開始按鈕等
    }
  } else {
    messageElement.textContent = '';
  }
}


// 事件監聽
upBtn.addEventListener('click', () => movePlayer(0, -1));
downBtn.addEventListener('click', () => movePlayer(0, 1));
leftBtn.addEventListener('click', () => movePlayer(-1, 0));
rightBtn.addEventListener('click', () => movePlayer(1, 0));

// 載入第一關
loadLevel();
