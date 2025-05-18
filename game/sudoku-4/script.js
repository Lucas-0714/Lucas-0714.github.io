document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberPad = document.getElementById('number-pad');
    const numberButtons = numberPad.querySelectorAll('button');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const messageDiv = document.getElementById('message');

    let solution = []; // 儲存完整的解決方案 (16個數字)
    let puzzle = [];   // 儲存帶有空位的謎題 (0 表示空位)
    let currentBoard = []; // 儲存玩家目前的輸入 (0 表示空位)
    let selectedCell = null; // 儲存目前選中的單元格元素

    const GRID_SIZE = 4;
    const BOX_SIZE = 2;

    // --- 謎題生成 ---
    // 注意：生成一個有唯一解且難度適中的數獨謎題是複雜的。
    // 以下是一個簡化的生成方法：先生成一個完整的解，再隨機移除數字。
    // 這不保證生成的謎題有唯一解或可解。

    function generateSolvedBoard() {
        // 產生一個完整的 4x4 數獨解
        let board = Array(GRID_SIZE * GRID_SIZE).fill(0);
        solveSudoku(board); // 使用回溯法填充完整的解
        return board;
    }

    function solveSudoku(board) {
        const findEmpty = (b) => {
            for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
                if (b[i] === 0) return i;
            }
            return -1; // 沒有空位，已解決
        };

        const isValid = (b, num, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;

            // 檢查行
            for (let c = 0; c < GRID_SIZE; c++) {
                if (c !== col && b[row * GRID_SIZE + c] === num) return false;
            }

            // 檢查列
            for (let r = 0; r < GRID_SIZE; r++) {
                if (r !== row && b[r * GRID_SIZE + col] === num) return false;
            }

            // 檢查 2x2 方塊
            const boxRowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
            const boxColStart = Math.floor(col / BOX_SIZE) * BOX_SIZE;
            for (let r = 0; r < BOX_SIZE; r++) {
                for (let c = 0; c < BOX_SIZE; c++) {
                    const checkIndex = (boxRowStart + r) * GRID_SIZE + (boxColStart + c);
                    if (checkIndex !== index && b[checkIndex] === num) return false;
                }
            }

            return true;
        };

        const emptyIndex = findEmpty(board);
        if (emptyIndex === -1) {
            return true; // 找到解了
        }

        const numbers = shuffleArray([1, 2, 3, 4]); // 隨機嘗試數字

        for (const num of numbers) {
            if (isValid(board, num, emptyIndex)) {
                board[emptyIndex] = num;
                if (solveSudoku(board)) {
                    return true; // 如果找到了下一層的解，則成功
                }
                board[emptyIndex] = 0; // 回溯
            }
        }

        return false; // 無法找到解
    }

    function createPuzzle(solvedBoard, cellsToRemove) {
        let newPuzzle = [...solvedBoard]; // 複製完整解
        let indices = shuffleArray(Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)); // 所有格子的索引
        let removedCount = 0;

        // 嘗試移除數字，移除夠數量為止
        // 注意：更嚴謹的做法是移除後檢查解的唯一性
        for (const index of indices) {
             if (removedCount < cellsToRemove) {
                const temp = newPuzzle[index];
                newPuzzle[index] = 0; // 暫時移除
                // 這裡可以加入一個檢查，確保移除後仍然有解
                // 但為簡化，我們假設移除一定數量即可
                 removedCount++;
            } else {
                break;
            }
        }
         return newPuzzle;
    }


    // --- 渲染棋盤 ---
    function renderBoard(boardData) {
        sudokuGrid.innerHTML = ''; // 清空現有的棋盤
        selectedCell = null; // 重置選中的格子
        numberPad.classList.add('hidden'); // 隱藏數字盤
        messageDiv.textContent = ''; // 清空訊息

        boardData.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index; // 儲存格子的索引

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('initial'); // 初始數字標記
            } else {
                cell.addEventListener('click', handleCellClick); // 添加點擊事件監聽器
            }

            sudokuGrid.appendChild(cell);
        });
         // 根據 currentBoard 更新顯示（玩家可能從上一局開始）
        updateBoardDisplay();
    }

    function updateBoardDisplay() {
         const cells = sudokuGrid.querySelectorAll('.cell');
         cells.forEach(cell => {
             const index = parseInt(cell.dataset.index);
             // 只更新非初始格子的內容和樣式
             if (!cell.classList.contains('initial')) {
                 const value = currentBoard[index];
                 cell.textContent = value !== 0 ? value : '';
                 // 清除之前的檢查結果樣式
                 cell.classList.remove('correct', 'incorrect');
             }
         });
    }

    // --- 處理使用者輸入 ---
    function handleCellClick(event) {
        const clickedCell = event.target;

        // 移除之前選中格子的樣式
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }

        // 設定新的選中格子
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');

        // 顯示數字輸入盤
        numberPad.classList.remove('hidden');

        // 可以嘗試將數字盤定位在選中格子附近，這裡先簡單顯示在下方
        // const rect = selectedCell.getBoundingClientRect();
        // numberPad.style.position = 'absolute';
        // numberPad.style.top = `${rect.bottom + 5}px`;
        // numberPad.style.left = `${rect.left}px`; // 簡單對齊左邊
    }

    // 處理數字按鈕點擊
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (selectedCell) {
                const number = parseInt(button.dataset.number);
                const index = parseInt(selectedCell.dataset.index);

                if (number === 0) { // 清除按鈕
                    selectedCell.textContent = '';
                    currentBoard[index] = 0;
                } else {
                    selectedCell.textContent = number;
                     currentBoard[index] = number;
                }

                // 移除選中樣式並隱藏數字盤
                selectedCell.classList.remove('selected');
                selectedCell = null;
                numberPad.classList.add('hidden');

                // 清除之前的檢查結果樣式
                sudokuGrid.querySelectorAll('.cell').forEach(cell => {
                    cell.classList.remove('correct', 'incorrect');
                });
                messageDiv.textContent = ''; // 清空訊息
            }
        });
    });

     // 點擊棋盤外部或非空閒單元格時隱藏數字盤 (簡單實現，可能需要更精確的點擊區域判斷)
     document.addEventListener('click', (event) => {
         if (selectedCell && !sudokuGrid.contains(event.target) && !numberPad.contains(event.target)) {
            selectedCell.classList.remove('selected');
            selectedCell = null;
            numberPad.classList.add('hidden');
         }
     });


    // --- 檢查答案 ---
    function checkAnswer() {
        let isCorrect = true;
        const cells = sudokuGrid.querySelectorAll('.cell');

        // 清除之前的檢查結果樣式
        cells.forEach(cell => {
            cell.classList.remove('correct', 'incorrect');
        });
        messageDiv.textContent = ''; // 清空訊息

        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = cells[i];
            const cellValue = currentBoard[i]; // 從玩家當前棋盤數據獲取值

            if (cellValue === 0) {
                // 空白格子不檢查正確性，但需要填滿才能算完成
                isCorrect = false; // 如果有空白，則不是完全正確
                continue;
            }

            // 檢查填寫的數字是否與解一致
            if (cellValue !== solution[i]) {
                cell.classList.add('incorrect');
                isCorrect = false;
            } else {
                 // 如果值正確且不是初始數字，可以標記一下 (可選)
                if (!cell.classList.contains('initial')) {
                    cell.classList.add('correct');
                }
            }
        }

        if (isCorrect) {
            messageDiv.textContent = '恭喜！答案正確！';
             sudokuGrid.querySelectorAll('.cell:not(.initial)').forEach(cell => cell.classList.add('correct')); // 所有填寫的格子都標記正確
        } else {
            // 檢查是否所有非初始格子都填寫了數字
            const allFilled = currentBoard.every((val, index) => puzzle[index] !== 0 ? true : val !== 0);

            if (!allFilled) {
                 messageDiv.textContent = '請填寫所有空白格子。';
            } else {
                 messageDiv.textContent = '答案不完全正確，請檢查標紅的格子。';
            }
        }
    }

    // --- 輔助函數 ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // 交換元素
        }
        return array;
    }

    // --- 初始化和事件綁定 ---
    function newGame() {
        solution = generateSolvedBoard(); // 生成一個完整的解
        // console.log("Solution:", solution); // 調試用
        puzzle = createPuzzle([...solution], 8); // 從解中移除 8 個數字作為謎題 (數量可調整)
        currentBoard = [...puzzle]; // 玩家當前棋盤從謎題開始
        renderBoard(puzzle); // 渲染棋盤
    }

    newGameBtn.addEventListener('click', newGame);
    checkBtn.addEventListener('click', checkAnswer);

    // 頁面載入完成後自動開始新遊戲
    newGame();
});
