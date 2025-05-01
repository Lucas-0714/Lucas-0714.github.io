const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const leftBtn = document.getElementById('leftBtn');
const jumpBtn = document.getElementById('jumpBtn');
const rightBtn = document.getElementById('rightBtn');

// 調整 canvas 大小以適應螢幕
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7; // 留一部分空間給控制按鈕

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
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    width: 100,
    height: 20,
    color: 'green'
};

const gravity = 0.5;
const jumpStrength = -10;
const moveSpeed = 5;

let moveLeft = false;
let moveRight = false;

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // 處理玩家的水平移動 (觸控)
    if (moveLeft) {
        player.x -= moveSpeed;
    }
    if (moveRight) {
        player.x += moveSpeed;
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

    // 允許跳躍 (觸控)
    if (jumpBtnPressed && !player.isJumping) {
        player.velocityY = jumpStrength;
        player.isJumping = true;
        jumpBtnPressed = false; // 防止持續觸發
    }

    // 邊界處理 (可選)
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
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

// 觸控事件處理
let jumpBtnPressed = false;

leftBtn.addEventListener('touchstart', () => { moveLeft = true; });
leftBtn.addEventListener('touchend', () => { moveLeft = false; });
rightBtn.addEventListener('touchstart', () => { moveRight = true; });
rightBtn.addEventListener('touchend', () => { moveRight = false; });
jumpBtn.addEventListener('touchstart', () => { jumpBtnPressed = true; });
jumpBtn.addEventListener('touchend', () => { jumpBtnPressed = false; });

// 調整遊戲循環以適應行動裝置 (可以省略 requestAnimationFrame，但通常建議使用)
gameLoop();

// 處理視窗大小調整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.7;
    // 需要重新定位和調整遊戲元素的位置，這裡省略
});
