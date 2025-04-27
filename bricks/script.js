const targetElement = document.documentElement; // 監聽整個頁面

targetElement.addEventListener('touchstart', (event) => {
    console.log('觸摸開始');
    // 獲取初始觸摸座標
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        console.log(`初始觸摸 ${i + 1}: X=${touch.clientX}, Y=${touch.clientY}`);
    }
});

targetElement.addEventListener('touchmove', (event) => {
    // 防止預設的滑動行為
    event.preventDefault();

    // 持續獲取觸摸座標
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        console.log(`持續觸摸 ${i + 1}: X=${touch.clientX}, Y=${touch.clientY}`);
        // 在這裡你可以使用 touch.clientX 和 touch.clientY 進行其他操作
    }
});

targetElement.addEventListener('touchend', (event) => {
    console.log('觸摸結束');
    // 可以檢查 event.changedTouches 來獲取離開螢幕的手指
    for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        console.log(`結束觸摸 ${i + 1}: X=${touch.clientX}, Y=${touch.clientY}`);
    }
});

targetElement.addEventListener('touchcancel', (event) => {
    console.log('觸摸被取消（例如：來電、系統操作）');
});
