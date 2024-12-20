function goBack() {
  // Navigate to the previous page
  window.location.href = "homepage.html";
}

function goNext() {
  // Navigate to the next page
  window.location.href = "next-page.html";
}
function openPDF() {
  const overlay = document.getElementById('overlay');
  const pdfViewer = document.getElementById('pdfViewer');
  overlay.style.display = 'block';
  pdfViewer.style.display = 'block';
}

function closePDF() {
  const overlay = document.getElementById('overlay');
  const pdfViewer = document.getElementById('pdfViewer');
  overlay.style.display = 'none';
  pdfViewer.style.display = 'none';
}
let gridData = []; // Holds the randomized grid data
const gridSize = 4; // 4x4 grid

// Define the agent's initial position
const agent = {
  x: 0,
  y: 3,
  hasGold: false,
  isArmed: false,
};

// Map types to image paths
const imageMap = {
  "breeze": "images/breeze.png",
  "breeze-stench": "images/breeze-stench.png",
  "gold": "images/gold.png",
  "pit": "images/pit.png",
  "player": "images/player.png",
  "player-armed": "images/player-armed.png",
  "stench": "images/stench.png",
  "wumpus": "images/wumpus.png",
  "wumpus-dead": "images/wumpus-dead.png",
  "start": "images/player.png",
  "empty": "", // Default for empty cells
};

// Randomize grid layout
function generateGrid() {
  // Initialize an empty grid
  gridData = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => ({ type: "empty" }))
    );

  // Place the player in the starting position
  gridData[3][0].type = "start";

  // Randomly place Wumpus, gold, and pits
  const positions = [];
  while (positions.length < 6) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if ((x !== 0 || y !== 3) && !positions.some(pos => pos.x === x && pos.y === y)) {
      positions.push({ x, y });
    }
  }

  gridData[positions[0].y][positions[0].x].type = "wumpus";
  gridData[positions[1].y][positions[1].x].type = "gold";
  for (let i = 2; i < positions.length; i++) {
    gridData[positions[i].y][positions[i].x].type = "pit";
  }

  // Add stench and breeze around Wumpus and pits
  for (let { x, y } of positions) {
    if (gridData[y][x].type === "wumpus") {
      addPercept(x, y, "stench");
    } else if (gridData[y][x].type === "pit") {
      addPercept(x, y, "breeze");
    }
  }
}

// Add percepts (stench or breeze) to adjacent cells
function addPercept(x, y, percept) {
  const neighbors = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
  neighbors.forEach(({ x, y }) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && gridData[y][x].type === "empty") {
      gridData[y][x].type = percept;
    }
  });
}

// Render the grid dynamically
function renderGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = ""; // Clear existing grid

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      const room = gridData[y][x];

      // Assign classes based on cell type
      cell.classList.add("cell");

      // Assign background image based on room type
      if (agent.x === x && agent.y === y) {
        cell.style.backgroundImage = agent.isArmed
          ? `url('${imageMap["player-armed"]}')`
          : `url('${imageMap["player"]}')`;
      } else if (room.type in imageMap) {
        cell.style.backgroundImage = `url('${imageMap[room.type]}')`;
      } else {
        cell.style.backgroundImage = ""; // Default empty cell
      }

      gridElement.appendChild(cell);
    }
  }
}

// Move the agent within the grid
function moveAgent(direction) {
  const previousX = agent.x;
  const previousY = agent.y;

  // Update position based on direction
  if (direction === "up" && agent.y > 0) agent.y--;
  if (direction === "down" && agent.y < gridSize - 1) agent.y++;
  if (direction === "left" && agent.x > 0) agent.x--;
  if (direction === "right" && agent.x < gridSize - 1) agent.x++;

  // Clear the agent from the previous position
  if (gridData[previousY][previousX].type === "start") {
    gridData[previousY][previousX].type = "empty";
  }

  // Check the current cell for interactions
  const room = gridData[agent.y][agent.x];
  if (room.type === "wumpus") {
    alert("You were eaten by the Wumpus!");
    restartGame();
    return;
  } else if (room.type === "pit") {
    alert("You fell into a pit!");
    restartGame();
    return;
  } else if (room.type === "gold") {
    agent.hasGold = true;
    alert("You grabbed the gold! Return to Start to win!");
  }

  // Check if the agent is back at the start with gold
  if (agent.x === 0 && agent.y === 3 && agent.hasGold) {
    alert("You win! You've successfully returned with the gold!");
    restartGame();
    return;
  }

  renderGrid();
}

// Reset the game to its initial state
function restartGame() {
  agent.x = 0;
  agent.y = 3;
  agent.hasGold = false;
  generateGrid();
  renderGrid();
}

// Grab the gold (optional button)
function grabGold() {
  const room = gridData[agent.y][agent.x];
  if (room.type === "gold") {
    agent.hasGold = true;
    gridData[agent.y][agent.x].type = "empty"; // Remove the gold from the grid
    alert("You grabbed the gold! Return to Start to win!");
  } else {
    alert("No gold here!");
  }
  renderGrid();
}

// Initialize the game on page load
generateGrid();
renderGrid();
