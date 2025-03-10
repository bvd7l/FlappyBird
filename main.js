// Constants and Variables
const BOARD_HEIGHT = 640;
const BOARD_WIDTH = 360;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_X = BOARD_WIDTH / 8;
const BIRD_Y = BOARD_HEIGHT / 2;
const PIPE_WIDTH = 64;
const PIPE_HEIGHT = 512;
const PIPE_X = BOARD_WIDTH;
const PIPE_Y = 0;
const GRAVITY = 0.4;
const JUMP_VELOCITY = -6;
const PIPE_VELOCITY = -2;
const OPENING_SPACE = BOARD_HEIGHT / 4;

let board;
let context;
let birdImg, topPipeImg, bottomPipeImg;
let bird;
let pipesArray = [];
let velocityY = 0;
let gameOver = false;
let score = 0;

// start the game
window.onload = function () {
    initializeBoard();
    loadImages();
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
};

function initializeBoard() {
    board = document.getElementById("board");
    board.height = BOARD_HEIGHT;
    board.width = BOARD_WIDTH;
    context = board.getContext("2d");
}

function loadImages() {
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.height, bird.width);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";
}

// Bird Object
bird = {
    x: BIRD_X,
    y: BIRD_Y,
    width: BIRD_HEIGHT,
    height: BIRD_WIDTH
};

// Game Loop
function update() {
    if (gameOver) return;

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    updateBird();
    updatePipes();
    drawScore();

    if (gameOver) {
        context.fillText("You Lost HAHAH!", 5, 120);
    }
}

function updateBird() {
    velocityY += GRAVITY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.height, bird.width);

    if (bird.y > board.height) {
        gameOver = true;
    }
}

function updatePipes() {
    for (let i = 0; i < pipesArray.length; i++) {
        let pipe = pipesArray[i];
        pipe.x += PIPE_VELOCITY;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipesArray.length > 0 && pipesArray[0].x < -PIPE_WIDTH) {
        pipesArray.shift();
    }
}

function drawScore() {
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

// Pipe Management
function placePipes() {
    if (gameOver) return;

    let randomPipeY = PIPE_Y - PIPE_HEIGHT / 4 - Math.random() * (PIPE_HEIGHT / 2);

    let topPipe = {
        img: topPipeImg,
        x: PIPE_X,
        y: randomPipeY,
        width: PIPE_WIDTH,
        height: PIPE_HEIGHT,
        passed: false
    };

    pipesArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: PIPE_X,
        y: randomPipeY + PIPE_HEIGHT + OPENING_SPACE,
        width: PIPE_WIDTH,
        height: PIPE_HEIGHT,
        passed: false
    };

    pipesArray.push(bottomPipe);
}

// Bird Move
function moveBird(event) {
    if (event.code == "Space" || event.code == "ArrowUp") {
        velocityY = JUMP_VELOCITY;

        if (gameOver) {
            resetGame();
        }
    }
}

function resetGame() {
    bird.y = BIRD_Y;
    pipesArray = [];
    score = 0;
    gameOver = false;
}

// Collision detection
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}