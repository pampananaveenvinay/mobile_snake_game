var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var score = 0;
var gameOver = false;
var paused = false;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

var speed = 10; // Default speed for easy level

// Get score element
var scoreElement = document.getElementById('score');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

document.getElementById('pause').addEventListener('click', function () {
  paused = !paused;
  if (paused) {
    cancelAnimationFrame(loop);
    this.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
  } else {
    requestAnimationFrame(loop);
    this.innerHTML = '<span class="material-symbols-outlined">pause</span>';
  }
});

function loop() {
  if (gameOver || paused) {
    if (gameOver) {
      window.location.href = 'gameover.html?score=' + score;
    }
    return;
  }

  requestAnimationFrame(loop);

  if (++count < speed) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver = true;
    return;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  context.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
        return;
      }
    }
  });

  // Draw score on top right
  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText('Score: ' + score, canvas.width - 80, 20);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

document.getElementById('up').addEventListener('click', function () {
  if (snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
});
document.getElementById('left').addEventListener('click', function () {
  if (snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
});
document.getElementById('down').addEventListener('click', function () {
  if (snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
document.getElementById('right').addEventListener('click', function () {
  if (snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
});

requestAnimationFrame(loop);
