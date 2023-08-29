let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// player
let playerWidth = 80;
let playerHeight = 10;

let playerVelocityX = 10;

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

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

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw initial player
  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer)
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  //draw initial player
  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = "white";
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
    // gameover
  }

  // bouncing ball off player paddle
  if (topCollion(ball, player) || bottomCollision(ball, player)) {
    ball.velocityY *= -1;
  }

  else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1;
  }
}

function outOfBounds(xPosition) {
  return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
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