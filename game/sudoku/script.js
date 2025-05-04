document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const messageArea = document.getElementById('message-area');
    const newGameBtn = document.getElementById('new-game-btn');
    const solveBtn = document.getElementById('solve-btn');
    // const difficultySelect = document.getElementById('difficulty-select'); // 可以後續加入難度控制

    const GRID_SIZE = 9;
    let currentPuzzle = []; // 當前的題目 (0 代表空格)
    let currentSolution = []; // 當前題目的完整解答
    let userBoard = []; // 用戶當前的填寫狀態

    // --- 數獨生成相關函數 ---

    // 輔助函數：洗牌算法 (Fisher-Yates) 用於隨機化數字順序
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // ES6 交換語法
        }
        return array;
    }

    // 檢查數字放置是否有效（用於生成和驗證）
    function isValid(board, row, col, num) {
        // 檢查行
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[row][c] === num && c !== col) {
                return false;
            }
        }
        // 檢查列
        for (let r = 0; r < GRID_SIZE; r++) {
            if (board[r][col] === num && r !== row) {
                return false;
            }
        }
        // 檢查 3x3 宮格
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] === num && (r !== row || c !== col)) {
                    return false;
                }
            }
        }
        return true;
    }

    // 尋找棋盤上的空格子
    function findEmpty(board) {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) {
                    return [r, c]; // 返回行和列
                }
            }
        }
        return null; // 沒有空格子了
    }

    // 回溯法生成一個完整的數獨解盤
    function generateSolvedSudoku(board) {
        const emptySpot = findEmpty(board);
        if (!emptySpot) {
            return true; // 棋盤已填滿
        }
        const [row, col] = emptySpot;

        // 隨機嘗試數字 1-9
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of nums) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num; // 放置數字

                // 遞歸調用
                if (generateSolvedSudoku(board)) {
                    return true; // 找到解了
                }

                // 回溯：如果遞歸失敗，撤銷當前數字
                board[row][col] = 0;
            }
        }

        return false; // 如果所有數字都試過且無解，返回 false
    }

    // 從完整解盤中移除數字生成題目
    // difficulty: 移除的格子數量 (大約值，越多越難)
    function createPuzzleFromSolution(solvedBoard, difficulty = 45) {
        let puzzle = JSON.parse(JSON.stringify(solvedBoard)); // 深拷貝
        let removedCells = 0;
        let attempts = 0; // 防止無限循環

        while (removedCells < difficulty && attempts < GRID_SIZE * GRID_SIZE * 2) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0; // 移除數字
                removedCells++;
                // 注意：更嚴謹的生成器會在這裡檢查移除後是否還有唯一解
                // 但這需要一個完整的解題器，此處簡化處理
            }
            attempts++;
        }
        return puzzle;
    }


    // --- 渲染棋盤 (與之前基本相同) ---
    function createBoard() {
        boardElement.innerHTML = ''; // 清空舊棋盤
        userBoard = JSON.parse(JSON.stringify(currentPuzzle)); // 深拷貝題目作為初始用戶狀態

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '9';

                if (currentPuzzle[r][c] !== 0) {
                    input.value = currentPuzzle[r][c];
                    input.disabled = true;
                } else {
                    input.addEventListener('input', handleInput);
                    input.addEventListener('focus', (e) => e.target.select());
                }
                cell.appendChild(input);
                boardElement.appendChild(cell);
            }
        }
    }

    // --- 處理用戶輸入 (與之前相同) ---
    function handleInput(event) {
        const inputElement = event.target;
        const row = parseInt(inputElement.closest('.sudoku-cell').dataset.row);
        const col = parseInt(inputElement.closest('.sudoku-cell').dataset.col);
        let value = parseInt(inputElement.value);

        if (isNaN(value) || value < 1 || value > 9) {
            inputElement.value = '';
            value = 0;
        }
        if (inputElement.value.length > 1) {
             inputElement.value = inputElement.value.slice(-1);
             value = parseInt(inputElement.value);
             if (isNaN(value) || value < 1 || value > 9) {
                 inputElement.value = '';
                 value = 0;
             }
        }

        userBoard[row][col] = value || 0;
        clearErrorHighlights();

        if (value !== 0 && !isValid(userBoard, row, col, value)) { // 使用 isValid 檢查
            inputElement.classList.add('error');
            highlightConflicts(userBoard, row, col, value); // 保持高亮衝突
            messageArea.textContent = '輸入的數字有衝突！';
            messageArea.className = 'error';
        } else {
            messageArea.textContent = '';
            messageArea.className = '';
            if (isBoardFull(userBoard)) {
                checkSolution();
            }
        }
    }

    // --- 驗證規則 (使用 isValid) ---
    // isValidMove 函數現在可以由 isValid 替代或基於 isValid 實現

    // --- 高亮衝突和清除 (與之前相同) ---
    function highlightConflicts(board, row, col, num) {
        // 檢查行衝突
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[row][c] === num && c !== col) {
                getCellInput(row, c)?.classList.add('error');
            }
        }
        // 檢查列衝突
        for (let r = 0; r < GRID_SIZE; r++) {
            if (board[r][col] === num && r !== row) {
                getCellInput(r, col)?.classList.add('error');
            }
        }
        // 檢查 3x3 宮格衝突
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] === num && (r !== row || c !== col)) {
                     getCellInput(r, c)?.classList.add('error');
                }
            }
        }
    }

    function clearErrorHighlights() {
         boardElement.querySelectorAll('.sudoku-cell input.error').forEach(input => {
            input.classList.remove('error');
        });
    }

    function getCellInput(row, col) {
        return boardElement.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"] input`);
    }

    // --- 檢查是否完成 (與之前相同) ---
     function isBoardFull(board) {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    // --- 檢查解答 (與之前基本相同，使用 currentSolution 比較) ---
     function checkSolution() {
        clearErrorHighlights();
        let isCorrect = true;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const userValue = userBoard[r][c];
                const solutionValue = currentSolution[r][c]; // 和生成的解比較
                 if(userValue === 0 || userValue !== solutionValue) {
                     isCorrect = false;
                     if (userValue !== 0) {
                        getCellInput(r,c)?.classList.add('error');
                     }
                 }
                 // 也可以再次驗證規則
                 if (userValue !== 0 && !isValid(userBoard, r, c, userValue)) {
                      isCorrect = false;
                      getCellInput(r,c)?.classList.add('error');
                      highlightConflicts(userBoard, r, c, userValue);
                 }
            }
        }

         if (isCorrect && isBoardFull(userBoard)) {
            messageArea.textContent = '恭喜！你完成了數獨！';
            messageArea.className = 'success';
            boardElement.querySelectorAll('input').forEach(input => input.disabled = true);
        } else if (isBoardFull(userBoard)) {
             messageArea.textContent = '還有些錯誤，請檢查標紅的格子。';
             messageArea.className = 'error';
        } else {
             // 棋盤未滿
        }
    }

    // --- 顯示答案 (與之前相同) ---
     function showSolution() {
        clearErrorHighlights();
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const inputElement = getCellInput(r, c);
                if (inputElement && !inputElement.disabled) {
                    inputElement.value = currentSolution[r][c];
                    userBoard[r][c] = currentSolution[r][c];
                    inputElement.classList.remove('error');
                }
                 // 同時也把題目本身數字填上（如果之前被清空過）
                 else if (inputElement && inputElement.disabled && !inputElement.value) {
                     inputElement.value = currentSolution[r][c];
                 }
            }
        }
         messageArea.textContent = '答案已顯示。';
         messageArea.className = '';
         boardElement.querySelectorAll('input').forEach(input => input.disabled = true);

    }

    // --- 新遊戲 (核心修改) ---
    function startNewGame() {
        messageArea.textContent = '正在生成新題目...'; // 提示用戶
        messageArea.className = '';
        boardElement.innerHTML = ''; // 清空舊棋盤以顯示提示

        // 使用 setTimeout 讓提示訊息有機會渲染出來，避免生成過程卡住 UI
        setTimeout(() => {
            // 1. 創建一個空的 9x9 棋盤
            let solvedBoard = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

            // 2. 使用回溯法生成完整解盤
            if (generateSolvedSudoku(solvedBoard)) {
                currentSolution = JSON.parse(JSON.stringify(solvedBoard)); // 保存完整解

                // 3. 從完整解盤中移除數字生成題目 (例如移除 45 個)
                currentPuzzle = createPuzzleFromSolution(solvedBoard, 45); // 數字越大越難

                // 4. 渲染新生成的題目棋盤
                createBoard();
                messageArea.textContent = ''; // 清除生成提示
            } else {
                 messageArea.textContent = '生成題目失敗，請重試。'; // 極少情況下可能失敗
                 messageArea.className = 'error';
            }
        }, 10); // 短暫延遲
    }

    // --- 事件監聽 (與之前相同) ---
    newGameBtn.addEventListener('click', startNewGame);
    solveBtn.addEventListener('click', showSolution);

    // --- 初始載入 ---
    startNewGame(); // 頁面載入時開始一個新遊戲

});
