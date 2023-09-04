let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// player
let playerWidth = 80; // 500 for testing
let playerHeight = 10;

let playerVelocityX = 10;

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3; // 15 for testing
let ballVelocityY = 2; // 10 for testing

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX
}

let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY
}

// blocks

let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

// starting block corners
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw initial player
  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);
  // Mouse moving eventListener and function
  document.addEventListener("mousemove", mouseMoveHandler, false);

  createBlocks();
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  //draw initial player
  context.fillStyle = "#8fb3ff";
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = "#ebf1ff";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // bounce ball
  // canvas top
  if (ball.y <= 0) {
    ball.velocityY *= -1;
  }

  else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    ball.velocityX *= -1;
  }

  else if (ball.y + ball.height >= boardHeight) {
    // if ball touches bottom of screen
    context.font = "20px sans-serif";
    context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
    gameOver = true;
  }

  // bouncing ball off player paddle
  if (topCollion(ball, player) || bottomCollision(ball, player)) {
    ball.velocityY *= -1;
  }

  else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1;
  }

  context.fillStyle = "#42fcab";
  for (let i = 0; i < blockArray.length; i++) {
    let block = blockArray[i];
    if (!block.break) {
      if (topCollion(ball, block) || bottomCollision(ball, block)) {
        block.break = true;
        ball.velocityY *= -1;
        blockCount -= 1;
        score += 100;
      }
      else if (leftCollision(ball, block) || rightCollision(ball, block)) {
        block.break = true;
        ball.velocityX *= -1;
        blockCount -= 1;
        score += 100;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  }

  if (blockCount == 0) {
    score += 100 * blockRows * blockColumns; // bonus points lol
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    createBlocks();
  }

  // score
  context.font = "20px sans-serif";
  context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
  return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
    }
  }

  if (e.code == "ArrowLeft") {
    // player.x -= player.velocityX;
    let nextPlayerX = player.x - player.velocityX;
    if (!outOfBounds(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  }
  else if (e.code == "ArrowRight") {
    let nextPlayerX = player.x + player.velocityX;
    if (!outOfBounds(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - board.offsetLeft;
  if (!outOfBounds(relativeX)) {
    player.x = relativeX;
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && // a's top right corner doesn't touch b's top right
    a.x + a.width > b.x &&  // a's top right passes b's top left
    a.y < b.y + b.height && // a's top left doesn't touch b's bottom left
    a.y + a.height > b.y;  // a's bottom left corner passes b's top left corner
}

function topCollion(ball, block) { // ball above block
  return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
  return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
  return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
  return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
  blockArray = [];
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 10, // space blocks 10
        y: blockY + r * blockHeight + r * 10, // space blocks 10
        width: blockWidth,
        height: blockHeight,
        break: false
      }
      blockArray.push(block);
      blockCount = blockArray.length;
    }
  }
}

function resetGame() {
  gameOver = false;
  player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
  }

  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
  }

  blockRows = 3;
  blockArray = [];
  score = 0;
  createBlocks();
}