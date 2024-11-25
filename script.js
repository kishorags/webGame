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

    // Start game logic
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(spawnObstacle, spawnRate);
    coinInterval = setInterval(spawnCoin, coinSpawnRate);
    timerInterval = setInterval(updateTimer, 1000); // Start timer countdown
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

    finalScore.innerText = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
}



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

function spawnObstacle() {
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

function spawnCoin() {
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
}



/* function spawnObstacle() {
    if (isGameOver) return;

    console.log("Spawning an obstacle..."); // Debugging log
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle'); // Add the "obstacle" class
    obstacle.style.left = lanes[Math.floor(Math.random() * 3)] + 'px'; // Random lane
    obstacle.style.top = '0px'; // Start at the top of the game container

    // Append the obstacle to the game container
    gameContainer.appendChild(obstacle);
    console.log("Obstacle added to DOM", obstacle); // Debugging log
}


// Spawn Coins
function spawnCoin() {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = lanes[Math.floor(Math.random() * 3)] + 'px';
    coin.style.top = '0px';
    gameContainer.appendChild(coin);
}
 */


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


startGame();