const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let player = { x: 50, y: canvas.height - 70, width: 50, height: 50, velocityY: 0, gravity: 0.5, isAlive: true };
let obstacles = [];
let frame = 0;
let gravityDirection = 1; // 1 for downward, -1 for upward
let isColorInverted = false;
let startTime = Date.now();
let gameSpeed = 6;
let score = 0; // New score variable

function createObstacle() {
    let size = Math.random() * 30 + 40;
    let gap = Math.random() * 150 + 100; // Random gap between obstacles
    let topObstacleHeight = Math.random() * (canvas.height / 2);

    obstacles.push(
        { x: canvas.width, y: 0, width: 30, height: topObstacleHeight }, // Top obstacle
        { x: canvas.width, y: topObstacleHeight + gap, width: 30, height: canvas.height - topObstacleHeight - gap } // Bottom obstacle
    );
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function drawPlayer() {
    ctx.fillStyle = isColorInverted ? "white" : "black";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = isColorInverted ? "black" : "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function handlePlayer() {
    player.velocityY += player.gravity * gravityDirection;
    player.y += player.velocityY;

    if (gravityDirection === 1 && player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
    }

    if (gravityDirection === -1 && player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            player.isAlive = false;
        }
    });
}

function invertColors() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime >= 30 && !isColorInverted) {
        isColorInverted = true;
    }
}

function drawScore() {
    ctx.fillStyle = isColorInverted ? "black" : "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 50);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    score++; // Increment score every frame
    invertColors();

    if (frame % 120 === 0) createObstacle();

    updateObstacles();
    drawPlayer();
    drawObstacles();
    drawScore(); // Draw the score on the screen
    handlePlayer();
    checkCollision();

    if (player.isAlive) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over! Press SPACE to restart.", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "center";
    }
}

function resetGame() {
    player.isAlive = true;
    player.y = canvas.height - 70;
    player.velocityY = 0;
    obstacles = [];
    frame = 0;
    score = 0; // Reset score
    startTime = Date.now();
    isColorInverted = false;
    gravityDirection = 1;
    gameLoop();
}

window.addEventListener("keydown", e => {
    if (e.code === "Space") {
        if (player.isAlive) {
            gravityDirection *= -1; // Reverse gravity
            player.velocityY = -10 * gravityDirection; // Add jump effect when reversing
        } else {
            resetGame(); // Restart game if player is dead
        }
    }
});

resetGame();
