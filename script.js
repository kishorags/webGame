// Select the elements from the HTML
const player = document.getElementById("player");
const item = document.getElementById("item");
const scoreDisplay = document.getElementById("score");

let score = 0;
let gameContainerWidth = 410;  // Adjust this to match your CSS dimensions
let itemFallSpeed = 2;         // Speed of the falling item
let isGameOver = false;

// Initialize player position
let playerX = 200;   // Center position, adjust based on container width
player.style.left = playerX + "px";

// Move player based on keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= 25;
    } else if (event.key === "ArrowRight" && playerX < gameContainerWidth - 70) {
        playerX += 25;
    }
    player.style.left = playerX + "px";
});

// Function to reset item position to fall again
function resetItemPosition() {
    item.style.top = "0px";
    item.style.left = Math.floor(Math.random() * (gameContainerWidth - 30)) + "px";
}

// Countdown timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isGameOver = true;
            alert(`Game Over! Your score is: ${score}`);
        } else {
            timeLeft--;
            timerDisplay.innerText = `Time Left: ${timeLeft}s`;
        }
    }, 1000);
}

// Function to trigger the blast effect
function triggerBlast() {
    item.classList.add("blast");
    setTimeout(() => {
        item.style.display = "none"; // Hide the item after the blast
        resetItemPosition();         // Reset for next fall
    }, 300); // Match this duration to the animation in CSS
}


// Main game loop: makes item fall and checks for collision
function gameLoop() {
    if (isGameOver) return;

    // Move item down
    let itemY = parseInt(item.style.top) || 0;
    itemY += itemFallSpeed;
    item.style.top = itemY + "px";

    // Check if item is out of bounds (missed by player)
    if (itemY > 400) {  // Adjust to match container height
        resetItemPosition();
    }

    // Check for collision with the player
    let itemX = parseInt(item.style.left);
    if (itemY > 350 && itemX >= playerX && itemX <= playerX + 50) {  // Adjust 350 based on player position
        score++;
        scoreDisplay.innerText = "Score: " + score;
        triggerBlast();
        resetItemPosition();
        
    }

    // Repeat loop
    requestAnimationFrame(gameLoop);
}

// Start the game
resetItemPosition();
startTimer()
gameLoop();
