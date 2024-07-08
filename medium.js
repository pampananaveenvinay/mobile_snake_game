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

var obstacles = []; // Array to store obstacle positions

var level = 'medium'; // Set level to 'medium'

var speed = 8; // Default speed for medium level

// Add more obstacles for medium level
for (let i = 0; i < 10; i++) { // Example: 10 obstacles
  let obstacle = {
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid
  };
  obstacles.push(obstacle);
}

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

function resetGame() {
  // Reset game variables
  score = 0;
  gameOver = false;
  paused = false;
  snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
  };
  obstacles = [];
  
  // Generate new obstacles
  for (let i = 0; i < 10; i++) { // Example: 10 obstacles
    let obstacle = {
      x: getRandomInt(0, 25) * grid,
      y: getRandomInt(0, 25) * grid
    };
    obstacles.push(obstacle);
  }

  // Start the game loop
  requestAnimationFrame(loop);
}

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

  // Draw obstacles
  context.fillStyle = 'gray';
  obstacles.forEach(function (obstacle) {
    context.fillRect(obstacle.x, obstacle.y, grid - 1, grid - 1);
  });

  // Draw snake
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

  // Draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw snake cells
  context.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Check collision with apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check collision with obstacles
    obstacles.forEach(function (obstacle) {
      if (cell.x === obstacle.x && cell.y === obstacle.y) {
        gameOver = true;
      }
    });

    // Check self-collision
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
        return;
      }
    }
  });

  // Draw score
  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText('Score: ' + score, canvas.width - 80, 30);
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
