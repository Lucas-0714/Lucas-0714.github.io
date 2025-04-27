const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

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
let touchStartX = null;
let touchStartY = null;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createApple() {
    apple.x = getRandomInt(0, canvas.width / grid) * grid;
    apple.y = getRandomInt(0, canvas.height / grid) * grid;
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
    });
}

function updateSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

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

    for (let i = 0; i < snake.cells.length - 1; i++) {
        if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
            gameOver();
            break;
        }
    }
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

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // 判斷滑動方向 (水平或垂直)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑動
        if (deltaX > 0 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        } else if (deltaX < 0 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
    } else {
        // 垂直滑動
        if (deltaY > 0 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        } else if (deltaY < 0 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
    }

    touchStartX = null;
    touchStartY = null;
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

createApple();
requestAnimationFrame(gameLoop);
