const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const grid = 20;
let count = 0;
let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: 320,
    y: 320
};
let score = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createApple() {
    apple.x = getRandomInt(0, canvas.width / grid) * grid;
    apple.y = getRandomInt(0, canvas.height / grid) * grid;
    console.log('蘋果生成在:', apple.x, apple.y);
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++count < 10) {
        return;
    }
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawApple();
    updateSnake();
    drawSnake();
    // console.log('gameLoop 運行中');
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.cells.forEach(function(cell, index) {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        if (index === snake.cells.length - 1) {
            ctx.fillStyle = 'green';
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        }
        // console.log('繪製蛇的 cell:', cell.x, cell.y);
    });
}

function updateSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;
    // console.log('蛇的位置:', snake.x, snake.y);

    // 邊界處理 (穿牆)
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.push({ x: snake.x, y: snake.y });

    while (snake.cells.length > snake.maxCells) {
        snake.cells.shift();
    }

    if (snake.x === apple.x && snake.y === apple.y) {
        snake.maxCells++;
        score++;
        scoreElement.textContent = `分數: ${score}`;
        createApple();
    }

    // 碰撞檢測 (吃到自己)
    for (let i = 0; i < snake.cells.length - 1; i++) {
        if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
            gameOver();
            break;
        }
    }
    // console.log('updateSnake 呼叫');
}

function gameOver() {
    alert(`遊戲結束！你的分數是 ${score}`);
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    scoreElement.textContent = `分數: ${score}`;
    createApple();
}

// 按鈕事件監聽器
upBtn.addEventListener('click', () => {
    if (snake.dy === 0 && snake.dx !== 0) { // 防止水平移動時向上
        snake.dy = -grid;
        snake.dx = 0;
        console.log('向上移動');
    } else if (snake.cells.length <= 1) { // 初始或長度為 1 時允許移動
        snake.dy = -grid;
        snake.dx = 0;
        console.log('向上移動 (初始)');
    }
});

downBtn.addEventListener('click', () => {
    if (snake.dy === 0 && snake.dx !== 0) { // 防止水平移動時向下
        snake.dy = grid;
        snake.dx = 0;
        console.log('向下移動');
    } else if (snake.cells.length <= 1) { // 初始或長度為 1 時允許移動
        snake.dy = grid;
        snake.dx = 0;
        console.log('向下移動 (初始)');
    }
});

leftBtn.addEventListener('click', () => {
    if (snake.dx === 0 && snake.dy !== 0) { // 防止垂直移動時向左
        snake.dx = -grid;
        snake.dy = 0;
        console.log('向左移動');
    } else if (snake.cells.length <= 1) { // 初始或長度為 1 時允許移動
        snake.dx = -grid;
        snake.dy = 0;
        console.log('向左移動 (初始)');
    }
});

rightBtn.addEventListener('click', () => {
    if (snake.dx === 0 && snake.dy !== 0) { // 防止垂直移動時向右
        snake.dx = grid;
        snake.dy = 0;
        console.log('向右移動');
    } else if (snake.cells.length <= 1) { // 初始或長度為 1 時允許移動
        snake.dx = grid;
        snake.dy = 0;
        console.log('向右移動 (初始)');
    }
});

createApple();
requestAnimationFrame(gameLoop);
