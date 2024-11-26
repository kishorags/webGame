// DOM Elements
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

// Variables
let lanes = [50, 130, 210]; // Positions for three lanes
let currentLane = 1; // Start in the middle lane
let score = 0;
let gameInterval, obstacleInterval, coinInterval;
let isGameOver = false;

// Variables
let timerInterval; // Timer interval
let timeLeft = 60; // Initial time (60 seconds)

// Start Game
function startGame() {
    gameOverScreen.style.display = 'none';
    isGameOver = false;
    score = 0;
    speed = 5; // Reset speed
    timeLeft = 60; // Reset timer
    spawnRate = 2000; // Reset spawn rate
    coinSpawnRate = 3000;

    currentLane = 1;
    player.style.left = lanes[currentLane] + 'px';
    scoreDisplay.innerText = `Score: ${score}`;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

    // Clear existing intervals
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(coinInterval);
    clearInterval(timerInterval);
//    clearInterval(gameSpeedInterval);

    // Start game logic
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(spawnObstacle, spawnRate);
    coinInterval = setInterval(spawnCoin, coinSpawnRate);
    timerInterval = setInterval(updateTimer, 1000); // Start timer countdown
    // Call this every 10 seconds
  //  gameSpeedInterval = setInterval(updateGameSpeed, 10000);

}

// Update Timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
    } else {
        endGame(); // End the game when the timer reaches zero
    }
}

// End Game

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(coinInterval);
    clearInterval(timerInterval);

    // Add flashing animation to the Game Over screen
    gameOverScreen.style.animation = 'flashGameOver 0.5s ease-in-out infinite';
    finalScore.innerText = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
}

// Add CSS keyframes dynamically through JavaScript
const styleSheet = document.createElement("style");

// Add CSS keyframes dynamically through JavaScript
styleSheet.innerText += `
@keyframes flashGameOver {
    0% { background-color: red; color: white; }
    50% { background-color: yellow; color: black; }
    100% { background-color: red; color: white; }
}`;




// Move Player
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowLeft' && currentLane > 0) {
        currentLane--;
        player.style.left = lanes[currentLane] + 'px';
    }
    if (e.key === 'ArrowRight' && currentLane < 2) {
        currentLane++;
        player.style.left = lanes[currentLane] + 'px';
    }
});

/* function spawnObstacle() {
    if (isGameOver) return;

    // Randomly select a lane for the obstacle
    let obstacleLane = lanes[Math.floor(Math.random() * 3)];

    // Check if any coin is already in the selected lane
    const coins = document.querySelectorAll('.coin');
    for (let coin of coins) {
        const coinLeft = parseInt(window.getComputedStyle(coin).getPropertyValue('left'));
        if (coinLeft === obstacleLane) {
            console.log('Coin present in lane, skipping obstacle spawn');
            return; // Skip spawning obstacle in this lane
        }
    }

    // Create and add the obstacle
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = obstacleLane + 'px';
    obstacle.style.top = '0px';
    gameContainer.appendChild(obstacle);
    console.log('Obstacle spawned in lane:', obstacleLane);
}
 */

function spawnObstacle() {
    if (isGameOver) return;

    let obstacleLane = lanes[Math.floor(Math.random() * 3)];

    const coins = document.querySelectorAll('.coin');
    for (let coin of coins) {
        const coinLeft = parseInt(window.getComputedStyle(coin).getPropertyValue('left'));
        if (coinLeft === obstacleLane) return; // Avoid overlap
    }

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = obstacleLane + 'px';
    obstacle.style.top = '0px';

    // Add bounce animation
    obstacle.style.animation = 'bounceObstacle 1s ease-in-out infinite';
    gameContainer.appendChild(obstacle);
}

// Add CSS keyframes dynamically through JavaScript
styleSheet.innerText += `
@keyframes bounceObstacle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}`;

/* function spawnCoin() {
    if (isGameOver) return;

    // Randomly select a lane for the coin
    let coinLane = lanes[Math.floor(Math.random() * 3)];

    // Check if any obstacle is already in the selected lane
    const obstacles = document.querySelectorAll('.obstacle');
    for (let obstacle of obstacles) {
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        if (obstacleLeft === coinLane) {
            console.log('Obstacle present in lane, skipping coin spawn');
            return; // Skip spawning coin in this lane
        }
    }

    // Create and add the coin
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = coinLane + 'px';
    coin.style.top = '0px';
    gameContainer.appendChild(coin);
    console.log('Coin spawned in lane:', coinLane);
} */


function spawnCoin() {
    if (isGameOver) return;

    let coinLane = lanes[Math.floor(Math.random() * 3)];

    const obstacles = document.querySelectorAll('.obstacle');
    for (let obstacle of obstacles) {
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        if (obstacleLeft === coinLane) return; // Avoid overlap
    }

    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = coinLane + 'px';
    coin.style.top = '0px';

    // Add rotation animation via JS
    coin.style.animation = 'rotateCoin 1.5s linear infinite';
    gameContainer.appendChild(coin);
}


styleSheet.innerText = `
@keyframes rotateCoin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}`;
document.head.appendChild(styleSheet);


// Update Game
function updateGame() {
    const obstacles = document.querySelectorAll('.obstacle');
    const coins = document.querySelectorAll('.coin');

    // Move Obstacles
    obstacles.forEach((obstacle) => {
        let top = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        obstacle.style.top = top + 5 + 'px';

        if (top > 500) {
            obstacle.remove();
        }

        // Collision Detection
        if (checkCollision(player, obstacle)) {
            endGame();
        }
    });

    // Move Coins
    coins.forEach((coin) => {
        let top = parseInt(window.getComputedStyle(coin).getPropertyValue('top'));
        coin.style.top = top + 5 + 'px';

        if (top > 500) {
            coin.remove();
        }

        // Coin Collection
        if (checkCollision(player, coin)) {
            coin.remove();
            score += 10;
            scoreDisplay.innerText = `Score: ${score}`; 
        }
    });
}


// Collision Detection
function checkCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return (
        aRect.left < bRect.right &&
        aRect.right > bRect.left &&
        aRect.top < bRect.bottom &&
        aRect.bottom > bRect.top
    );
}

function updateGameSpeed() {
    speed += 0.05; // Gradually increase speed
    spawnRate = Math.max(1000, spawnRate - 100); // Decrease spawn intervals
    coinSpawnRate = Math.max(1500, coinSpawnRate - 100);

    clearInterval(obstacleInterval);
    clearInterval(coinInterval);
    obstacleInterval = setInterval(spawnObstacle, spawnRate);
    coinInterval = setInterval(spawnCoin, coinSpawnRate);
}

setInterval(updateGameSpeed, 10000);

startGame();