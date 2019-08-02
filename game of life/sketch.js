//press SHIFT key to pause the game
//press OPTION key to re-randomize the population

let grid;
let playMode = true;
let pressed = false;
let generation = 0;
let aliveCell = 0;


function setup() {
  let canvas = createCanvas(400, 400).addClass('canvas');
  let button = createButton("Reset").addClass('button');
  let button1 = createButton("Randomize").addClass('button');
  let button2 = createButton("Start").addClass('button');
  grid = new Grid(10);
  grid.randomize();
  //grid.customize();
  button.mousePressed(resetSketch);
  button1.mousePressed(randomizeGame);
  // button2.mousePressed(grid.)
}

function resetSketch() {
  createCanvas(400, 400);
  grid = new Grid(10);
  generation = 0;
  aliveCell = 0;
  //grid.randomize();
}

function randomizeGame() {
  createCanvas(400,400);
  grid = new Grid(10);
  grid.randomize();
}

function draw() {
  background(250);
  if (playMode) {
    grid.updateNeighborCounts();
    grid.updatePopulation();
    generation = generation + 1;
  }
  grid.draw();
  fill(0);
  text(updateGeneration(), 10, 20);
  text(countALiveCell(), 10, 40);
}

function reset() {
  background(250);
  //grid.randomize();
  grid.updateNeighborCounts();
  grid.updatePopulation();
  grid.draw();
}

class Grid {
  constructor (cellSize) {
    this.cellSize = cellSize;
    this.numberOfRows = height/cellSize;
    this.numberOfColumns = width/cellSize;
    this.cells = new Array(this.numberOfColumns);

    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array(this.numberOfRows);
    }
    for (let column = 0; column < this.numberOfColumns; column ++) {
      for (let row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row] = new Cell(column, row, cellSize);
      }
    }
    print(this.cells);
    background(250);
  }


  draw() {
    for (let column = 0; column < this.numberOfColumns; column ++) {
      for (let row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].draw();
      }
    }
  }

  randomize() {
    for (let row = 0; row < this.numberOfRows; row++) {
      for (let column = 0; column < this.numberOfColumns; column++) {
        let r = floor(random(2));
        if (r == 1) {
          this.cells[row][column].setIsALive(true);
        } else{
          this.cells[row][column].setIsALive(false);
        }
      }
    }
  }

  customize() {
    if (this.cells[Math.floor(mouseX/this.cellSize)][Math.floor(mouseY/this.cellSize)].isAlive) {
      this.cells[Math.floor(mouseX/this.cellSize)][Math.floor(mouseY/this.cellSize)].setIsALive(false);
    }else {
      this.cells[Math.floor(mouseX/this.cellSize)][Math.floor(mouseY/this.cellSize)].setIsALive(true);
    }
  }
  updatePopulation() {
    aliveCell = 0;
    for (let row = 0; row < this.numberOfRows; row++) {
      for (let column = 0; column < this.numberOfColumns; column++) {
        this.cells[row][column].liveOrDie();
        if (this.cells[row][column].isAlive) {
          aliveCell++;
        }
      }
    }
  }

  getNeighbors(currentCell) {
    let neighbors = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        let neighborColumn = currentCell.column + xOffset;
        let neighborRow = currentCell.row + yOffset;
        if (neighborColumn != currentCell.column || neighborRow != currentCell.row) {
          if (this.isValidPosition(neighborColumn, neighborRow)) {
            neighbors.push(this.cells[neighborColumn][neighborRow]);
          }
        }
      }
    }
    return neighbors;
  }

  isValidPosition(column, row) {
    if (column >= 0 && column < this.numberOfColumns && row >= 0 && row < this.numberOfRows) {
      return true;
    }
    else {
      return false;
    }
  }

  updateNeighborCounts() {
    for (let r = 0; r < this.numberOfRows; r++) {
      for (let c = 0; c < this.numberOfColumns; c++) {
        this.cells[r][c].liveNeighborCount = 0;
        let neighbors = this.getNeighbors(this.cells[r][c]);
        for (let i = 0; i < neighbors.length; i++) {
          if (neighbors[i].isAlive) {
            this.cells[r][c].liveNeighborCount++;
          }
        }
      }
    }
  }
}


class Cell {
  constructor(column, row, size) {
    this.column = column;
    this.row = row;
    this.size = size;
    this.isAlive = false;
    this.liveNeighborCount = 0;
  }

  liveOrDie() {
    if (this.isAlive) {
      if (this.liveNeighborCount < 2 || this.liveNeighborCount > 3) {
        this.isAlive = false;
      }
      else if (this.liveNeighborCount == 2 || this.liveNeighborCount == 3) {
        this.isAlive = true;
      }
    }
    else {
      if (this.liveNeighborCount == 3) {
        this.isAlive = true;
      }
    }
  }

  draw() {
    if (!this.isAlive) {
      fill(240);
    }
    else {
      fill(200,0,200);
    }
    noStroke();
    rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
  }

  setIsALive(value) {
    if (value) {
      this.isAlive = true;
    }
    else {
      this.isAlive = false;
    }
  }
}

function mousePressed() {
  console.log('mousePressed x,', mouseX, 'y,', mouseY);
  grid.customize();
}

function keyPressed() {
  if (keyCode == OPTION) {
    generation = 0;
    aliveCell = 0;
    grid.randomize();
  }
  if (keyCode == SHIFT) {
    playMode = !playMode;
  }
  return false;
}

function updateGeneration() {
  return "Generation: " + generation;
}

function countALiveCell() {
  return "Live cells: " + aliveCell;
}
