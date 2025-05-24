// 圖片及對應文字的陣列
const imagesData = [
    { src: "sine.jpg", text: "sin(x)" }, 
    { src: "cosine.jpg", text: "cos(x)" }, 
    { src: "tangent.jpg", text: "tan(x)" }, 
    { src: "cotangent.jpg", text: "cot(x)" }, 
    { src: "second.jpg", text: "sec(x)" }, 
    { src: "cosecond.jpg", text: "csc(x)" }, 
    { src: "co-sine.jpg", text: "sin(x), cos(x)" }, 
    { src: "co-tangent.jpg", text: "tan(x), cot(x)" }, 
    { src: "co-second.jpg", text: "sec(x), csc(x)" }, 
    { src: "all.jpg", text: "sin(x), cos(x), tan(x), cot(x), sec(x), csc(x)" }
];
let currentIndex = 0; // 當前顯示圖片的索引

// 獲取 HTML 元素
const myImage = document.getElementById("myImage");
const imageText = document.getElementById("imageText"); // 新增：顯示文字的元素
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// 更新圖片和文字的函數
function updateImageAndText() {
    myImage.src = imagesData[currentIndex].src;
    imageText.textContent = imagesData[currentIndex].text; // 更新文字內容
}

// 點擊「上一張」按鈕
prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = imagesData.length - 1; // 如果是第一張，就回到最後一張
    }
    updateImageAndText();
});

// 點擊「下一張」按鈕
nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= imagesData.length) {
        currentIndex = 0; // 如果是最後一張，就回到第一張
    }
    updateImageAndText();
});

// 網頁載入時顯示第一張圖片和文字
updateImageAndText();
