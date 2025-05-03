const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let bird;
let pipes = [];
let score = 0;
let gameInterval;
let isGameStarted = false;

const birdImg = new Image();
birdImg.src = 'bird.png'; // 你需要一個 bird.png 的圖片
const pipeTopImg = new Image();
pipeTopImg.src = 'pipe_top.png'; // 你需要一個 pipe_top.png 的圖片
const pipeBottomImg = new Image();
pipeBottomImg.src = 'pipe_bottom.png'; // 你需要一個 pipe_bottom.png 的圖片

const gravity = 0.2;
const flapStrength = -6;
const pipeSpeed = -2;
const pipeInterval = 150; // 每隔多少幀生成新的水管

class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.width = 34;
        this.height = 24;
    }

    draw() {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocity += gravity;
        this.y += this.velocity;
    }

    flap() {
        this.velocity = flapStrength;
    }
}

class Pipe {
    constructor(x, gapHeight = 150) {
        this.x = x;
        this.topHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        this.bottomY = this.topHeight + gapHeight;
        this.width = 52;
    }

    draw() {
        ctx.drawImage(pipeTopImg, this.x, 0, this.width, this.topHeight);
        ctx.drawImage(pipeBottomImg, this.x, this.bottomY, this.width, canvas.height - this.bottomY);
    }

    update() {
        this.x += pipeSpeed;
    }

    isOffscreen() {
        return this.x < -this.width;
    }
}

function resetGame() {
    bird = new Bird(canvas.width / 4, canvas.height / 2);
    pipes = [];
    score = 0;
    scoreElement.textContent = score;
    clearInterval(gameInterval);
    isGameStarted = false;
    startButton.textContent = '開始遊戲';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver();
        return;
    }

    pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();

        // 碰撞檢測
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
        ) {
            gameOver();
            return;
        }

        // 計分
        if (pipe.x + pipe.width < bird.x && !pipe.counted) {
            score++;
            scoreElement.textContent = score;
            pipe.counted = true;
        }
    });

    pipes = pipes.filter(pipe => !pipe.isOffscreen());

    if (gameInterval % pipeInterval === 0) {
        pipes.push(new Pipe(canvas.width));
    }

    gameInterval++;
    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetGame();
    isGameStarted = true;
    startButton.textContent = '點擊或按空白鍵跳躍';
    gameInterval = 0;
    requestAnimationFrame(gameLoop);
}

function flap() {
    if (isGameStarted) {
        bird.flap();
    }
}

function gameOver() {
    isGameStarted = false;
    startButton.textContent = '遊戲結束，點擊或按空白鍵重新開始';
    clearInterval(gameInterval);
}

// 事件監聽
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isGameStarted) {
        startGame();
    } else if (e.key === ' ' && isGameStarted) {
        flap();
    }
});
canvas.addEventListener('click', flap);
