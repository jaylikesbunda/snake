document.addEventListener("DOMContentLoaded", function() {
// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set up the game variables
const blockSize = 10;
const widthInBlocks = canvas.width / blockSize;
const heightInBlocks = canvas.height / blockSize;
let score = 0;

// Set up the snake
let snake = [];
snake[0] = {
    x: Math.floor(widthInBlocks / 2),
    y: Math.floor(heightInBlocks / 2)
};
let direction = "right";

// Set up the food
let food = generateFood();

// Set the canvas size and add the resize event listener
function setCanvasSize() {
    const canvasWrapper = document.getElementById("canvas-wrapper");
    const side = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = side - 4; // Subtract 4 to account for the border width
    canvas.height = side - 4; // Subtract 4 to account for the border width
    canvasWrapper.style.width = `${side}px`;
    canvasWrapper.style.height = `${side}px`;
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// Function to generate random food coordinates
function generateFood() {
    return {
        x: Math.floor(Math.random() * (widthInBlocks - 1)) + 1,
        y: Math.floor(Math.random() * (heightInBlocks - 1)) + 1
    };
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();
    checkFood();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();
// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(snake[i].x * blockSize, snake[i].y * blockSize, blockSize, blockSize);
    }
}

// Draw the food
function drawFood() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// Move the snake
function moveSnake() {
    const head = {
        x: snake[0].x,
        y: snake[0].y
    };

    switch (direction) {
        case "right":
            head.x++;
            break;
        case "left":
            head.x--;
            break;
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
    }

    snake.unshift(head);
    snake.pop();
}
// Check for collision with walls or self
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= widthInBlocks || head.y < 0 || head.y >= heightInBlocks) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// Check for collision with food
function checkFood() {
    const head = snake[0];

    if (head.x === food.x && head.y === food.y) {
        snake.push({
            x: food.x,
            y: food.y
        });
        score++;
        food = generateFood();
    }
}

// Draw the score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, blockSize, blockSize * 2);
}
// Game over
function gameOver() {
    snake = [];
    snake[0] = {
        x: Math.floor(widthInBlocks / 2),
        y: Math.floor(heightInBlocks / 2)
    };
    direction = "right";
    score = 0;
    food = generateFood();
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            if (direction !== "right") {
                direction = "left";
            }
            break;
        case 38: // Up arrow
            if (direction !== "down") {
                direction = "up";
            }
            break;
        case 39: // Right arrow
            if (direction !== "left") {
                direction = "right";
            }
            break;
        case 40: // Down arrow
            if (direction !== "up") {
                direction = "down";
            }
            break;
    }
});
// Handle touch input
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "left") {
            direction = "right";
        } else if (deltaX < 0 && direction !== "right") {
            direction = "left";
        }
    } else {
        if (deltaY > 0 && direction !== "up") {
            direction = "down";
        } else if (deltaY < 0 && direction !== "down") {
            direction = "up";
        }
    }
}
});





