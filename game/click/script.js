const clickButton = document.getElementById('clickButton');
const counterElement = document.getElementById('counter');
const resetButton = document.getElementById('resetButton');

const STORAGE_KEY = 'clickCounter'; // 定義 localStorage 的鍵

let clickCount = localStorage.getItem(STORAGE_KEY) ? parseInt(localStorage.getItem(STORAGE_KEY)) : 0;

// 頁面載入時更新計數器顯示
counterElement.textContent = `點擊次數：${clickCount}`;

// 點擊按鈕的事件監聽器
clickButton.addEventListener('click', () => {
    clickCount++;
    counterElement.textContent = `點擊次數：${clickCount}`;
    localStorage.setItem(STORAGE_KEY, clickCount); // 將計數儲存到 localStorage
});

// 重置按鈕的事件監聽器
resetButton.addEventListener('click', () => {
    clickCount = 0;
    counterElement.textContent = `點擊次數：${clickCount}`;
    localStorage.removeItem(STORAGE_KEY); // 從 localStorage 移除計數
});
