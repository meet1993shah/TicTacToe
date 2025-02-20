document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const turnIndicator = document.getElementById("turn-indicator");

    board.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

    let currentPlayer = "X";
    let boardState = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    let winCondition = gridSize === 3 ? 3 : 4;
    let playerNames = { "X": player1, "O": player2 };
    let moves = 0; // Track total moves to detect a draw

    turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", () => {
                if (!cell.textContent && !checkWin()) {
                    cell.textContent = currentPlayer;
                    cell.classList.add(currentPlayer === "X" ? "player1" : "player2");
                    boardState[row][col] = currentPlayer;
                    moves++;

                    if (checkWin()) {
                        turnIndicator.textContent = `${playerNames[currentPlayer]} Wins! 🎉`;
                        triggerConfetti();
                        return;
                    }

                    if (moves === gridSize * gridSize) {
                        turnIndicator.textContent = "It's a Draw! 🤝";
                        triggerHandshake();
                        return;
                    }

                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
                }
            });

            board.appendChild(cell);
        }
    }

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
