document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const turnIndicator = document.getElementById("turn-indicator");
    const undoButton = document.getElementById("undo-btn"); // Get the undo button

    // Adjust cell size based on grid size
    let cellSize;
    if (gridSize === 3) {
        cellSize = 80;
    } else if (gridSize === 4) {
        cellSize = 70;
    } else if (gridSize === 5) {
        cellSize = 60;
    } else {
        cellSize = 50; // For grid size 6
    }

    board.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

    let currentPlayer = "X";
    let boardState = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    let history = []; // To store previous board states
    let winCondition = gridSize === 3 ? 3 : 4;
    let playerNames = { "X": player1, "O": player2 };
    let moves = 0; // Track total moves to detect a draw

    turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;

    // Update the board when a move is made
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Dynamically set the cell width and height
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;

            cell.addEventListener("click", () => {
                if (!cell.textContent && !checkWin()) {
                    // Save the current state to history before making the move
                    history.push(JSON.parse(JSON.stringify(boardState))); // Deep clone the state

                    // Make the move
                    cell.textContent = currentPlayer;
                    cell.classList.add(currentPlayer === "X" ? "player1" : "player2");
                    boardState[row][col] = currentPlayer;
                    moves++;

                    // Check if someone won
                    if (checkWin()) {
                        turnIndicator.textContent = `${playerNames[currentPlayer]} Wins! 🎉`;
                        triggerConfetti();
                        return;
                    }

                    // Check for draw
                    if (moves === gridSize * gridSize) {
                        turnIndicator.textContent = "It's a Draw! 🤝";
                        triggerHandshake();
                        return;
                    }

                    // Switch to the other player
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
                }
            });

            board.appendChild(cell);
        }
    }

    // Function to undo the last move
    function undoMove() {
        if (history.length > 0) {
            // Revert to the last board state
            boardState = history.pop(); // Get the last state from history
            moves--; // Decrease move count

            // Update the UI to reflect the previous state
            const cells = board.querySelectorAll(".cell");
            cells.forEach(cell => {
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                const cellValue = boardState[row][col];

                // Update cell text content
                cell.textContent = cellValue;

                // Remove any previous player colors
                cell.classList.remove("player1", "player2");

                // Add the player color back if the cell is filled
                if (cellValue === "X") {
                    cell.classList.add("player1");
                } else if (cellValue === "O") {
                    cell.classList.add("player2");
                }
            });

            // Switch the player turn back
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
        }
    }

    // Attach undoMove to the undo button's click event
    undoButton.addEventListener("click", undoMove);

    // Function to check for a win condition
    function checkWin() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col <= gridSize - winCondition; col++) {
                if (boardState[row].slice(col, col + winCondition).every(cell => cell === currentPlayer)) {
                    return true;
                }
            }
        }

        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row <= gridSize - winCondition; row++) {
                if (boardState.slice(row, row + winCondition).map(r => r[col]).every(cell => cell === currentPlayer)) {
                    return true;
                }
            }
        }

        for (let row = 0; row <= gridSize - winCondition; row++) {
            for (let col = 0; col <= gridSize - winCondition; col++) {
                if ([...Array(winCondition)].map((_, i) => boardState[row + i][col + i]).every(cell => cell === currentPlayer)) {
                    return true;
                }
            }
        }

        for (let row = 0; row <= gridSize - winCondition; row++) {
            for (let col = winCondition - 1; col < gridSize; col++) {
                if ([...Array(winCondition)].map((_, i) => boardState[row + i][col - i]).every(cell => cell === currentPlayer)) {
                    return true;
                }
            }
        }

        return false;
    }

    function triggerConfetti() {
        // Disable Undo button when there's a winner
        undoButton.disabled = true;

        let duration = 2 * 1000;
        let end = Date.now() + duration;

        function frame() {
            confetti({
                particleCount: 5,
                spread: 100,
                startVelocity: 40,
                origin: { x: Math.random(), y: Math.random() }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }

        frame();
    }

    function triggerHandshake() {
        // Disable Undo button when the game is a draw
        undoButton.disabled = true;

        let emoji = document.createElement("div");
        emoji.textContent = "🤝";
        emoji.style.position = "fixed";
        emoji.style.top = "50%";
        emoji.style.left = "50%";
        emoji.style.fontSize = "100px";
        emoji.style.transform = "translate(-50%, -50%)";
        emoji.style.animation = "shake 1s ease-in-out infinite";
        document.body.appendChild(emoji);

        setTimeout(() => {
            emoji.remove();
        }, 2000);
    }
});
