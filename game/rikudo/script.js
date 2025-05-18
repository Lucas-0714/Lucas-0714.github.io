document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const messageDiv = document.getElementById('message');

    let boardData = [];
    let solution = [];
    let gridSize = { rows: 5, cols: 5 }; // 可以調整網格大小
    let currentNumber = 1;
    let selectedCells = {}; // 儲存已選取的格子和數字

    function generatePuzzle(rows, cols) {
        // 這裡實現自動生成謎題的邏輯
        // 這是一個簡化的版本，實際生成一個可解的 Rikudo 謎題需要更複雜的算法
        const totalCells = rows * cols;
        const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
        solution = shuffleArray(numbers);
        boardData = Array(rows * cols).fill(null);

        // 隨機顯示一些初始數字
        const initialNumbersCount = Math.floor(totalCells * 0.2);
        const initialIndices = shuffleArray(Array.from({ length: totalCells }, (_, i) => i)).slice(0, initialNumbersCount);
        initialIndices.forEach(index => {
            boardData[index] = solution[index];
        });
    }

    function createBoard(rows, cols) {
        gameBoard.innerHTML = '';
        boardData = [];
        selectedCells = {};
        currentNumber = 1;

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.classList.add('hexagon-row');
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                const hexagon = document.createElement('div');
                hexagon.classList.add('hexagon');
                hexagon.dataset.index = index;

                if (boardData[index] !== null) {
                    hexagon.textContent = boardData[index];
                    hexagon.classList.add('filled');
                } else {
                    hexagon.addEventListener('click', () => handleCellClick(hexagon));
                }
                row.appendChild(hexagon);
            }
            gameBoard.appendChild(row);
            // 調整行的內邊距以形成六邊形網格的視覺效果
            if (i % 2 !== 0) {
                row.style.paddingLeft = '35px'; // 大約一個半六邊形的寬度
            }
        }
    }

    function handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        if (!selectedCells[index]) {
            cell.textContent = currentNumber;
            cell.classList.add('filled');
            selectedCells[index] = currentNumber;
            currentNumber++;

            if (Object.keys(selectedCells).length === boardData.length - boardData.filter(val => val !== null).length) {
                // 所有空格都已填寫，自動檢查
                checkAnswer();
            }
        }
    }

    function checkAnswer() {
        let isCorrect = true;
        const filledCellsOrder = Object.keys(selectedCells).sort((a, b) => selectedCells[a] - selectedCells[b]).map(Number);
        const initialCells = boardData.reduce((acc, val, index) => {
            if (val !== null) {
                acc[index] = val;
            }
            return acc;
        }, {});

        // 檢查初始數字是否在正確的位置
        for (const index in initialCells) {
            if (parseInt(index) >= solution.length || initialCells[index] !== solution[parseInt(index)]) {
                isCorrect = false;
                break;
            }
        }

        // 檢查填寫的數字順序是否正確（簡化檢查，實際Rikudo需要檢查相鄰性）
        if (isCorrect) {
            for (let i = 0; i < filledCellsOrder.length; i++) {
                const boardIndex = filledCellsOrder[i];
                const solvedNumber = solution[boardIndex];
                if (selectedCells[boardIndex] !== solvedNumber) {
                    isCorrect = false;
                    const incorrectCell = document.querySelector(`.hexagon[data-index="${boardIndex}"]`);
                    if (incorrectCell) {
                        incorrectCell.classList.add('incorrect');
                    }
                } else {
                    const correctCell = document.querySelector(`.hexagon[data-index="${boardIndex}"]`);
                    if (correctCell && !incorrectCell) {
                        correctCell.classList.add('correct');
                    }
                }
            }
        }

        if (isCorrect) {
            messageDiv.textContent = '恭喜！答案正確！';
        } else {
            messageDiv.textContent = '答案不完全正確，請再檢查。';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    newGameBtn.addEventListener('click', () => {
        generatePuzzle(gridSize.rows, gridSize.cols);
        createBoard(gridSize.rows, gridSize.cols);
        messageDiv.textContent = '';
    });

    checkBtn.addEventListener('click', checkAnswer);

    // 初始載入時生成並創建一個新的遊戲
    generatePuzzle(gridSize.rows, gridSize.cols);
    createBoard(gridSize.rows, gridSize.cols);
});
