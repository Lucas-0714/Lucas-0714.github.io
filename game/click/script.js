const clickButton = document.getElementById('clickButton');
const counterElement = document.getElementById('counter');
const resetButton = document.getElementById('resetButton');

let clickCount = 0;

// 點擊按鈕的事件監聽器
clickButton.addEventListener('click', () => {
    clickCount++;
    counterElement.textContent = `點擊次數：${clickCount}`;
});

// 重置按鈕的事件監聽器
resetButton.addEventListener('click', () => {
    clickCount = 0;
    counterElement.textContent = `點擊次數：${clickCount}`;
});
