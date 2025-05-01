const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 50,
    color: 'red',
    velocityY: 0,
    isJumping: false
};

const platform = {
    x: 200,
    y: canvas.height - 100,
    width: 100,
    height: 20,
    color: 'green'
};

const gravity = 0.5;
const jumpStrength = -10;

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // 處理玩家的水平移動
    if (keys['ArrowLeft']) {
        player.x -= 5;
    }
    if (keys['ArrowRight']) {
        player.x += 5;
    }

    // 處理跳躍
    player.velocityY += gravity;
    player.y += player.velocityY;

    // 碰撞檢測 (與平台)
    if (
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y + player.height > platform.y &&
        player.y < platform.y + platform.height &&
        player.velocityY >= 0
    ) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    } else if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // 允許跳躍
    if (keys['ArrowUp'] && !player.isJumping) {
        player.velocityY = jumpStrength;
        player.isJumping = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製平台
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // 繪製玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

gameLoop();
