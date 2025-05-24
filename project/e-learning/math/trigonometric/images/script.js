// 圖片的檔案名稱列表
const images = ["sine.jpg", "cosine.jpg", "tangent.jpg", "cotangent.jpg", "second.jpg", "cosecond.jpg", "co-sine.jpg", "co-tangent.jpg", "co-second.jpg", "all.jpg"];
let currentIndex = 0; // 當前顯示圖片的索引

// 獲取 HTML 元素
const myImage = document.getElementById("myImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// 更新圖片的函數
function updateImage() {
    myImage.src = images[currentIndex];
}

// 點擊「上一張」按鈕
prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = images.length - 1; // 如果是第一張，就回到最後一張
    }
    updateImage();
});

// 點擊「下一張」按鈕
nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0; // 如果是最後一張，就回到第一張
    }
    updateImage();
});

// 初始化時顯示第一張圖片 (可選，因為HTML已經設定了image1.jpg)
// updateImage();
