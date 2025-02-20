document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const gridSizeInput = document.getElementById("grid_size");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");

    // Auto-focus Player 1 input on page load
    player1Input.focus();

    form.addEventListener("submit", (event) => {
        let gridSize = parseInt(gridSizeInput.value, 10);
        let player1 = player1Input.value.trim();
        let player2 = player2Input.value.trim();

        // Validate grid size (ensure it's between 3 and 6)
        if (gridSize < 3 || gridSize > 6) {
            alert("Grid size must be between 3 and 6.");
            event.preventDefault();
            return;
        }

        // Ensure both player names are entered
        if (!player1 || !player2) {
            alert("Please enter both player names.");
            event.preventDefault();
        }
    });
});
