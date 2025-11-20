const canvasContainer = document.getElementById('canvas-container');

let cellSize;
const cellsPerRow = 11;
const cells = [];
let hoveredCell = null;

// 초기 설정 함수: 캔버스 생성 + 초기 세포 생성 + 세대 미리 쌓기
function setup() {
  const renderer = createCanvas(660, 660);
  renderer.parent(canvasContainer);

  cellSize = width / cellsPerRow;
  // 맨 위 셀 생성
  for (let n = 0; n < cellsPerRow; n++) {
    cells.push(
      new Cell(
        // 화면 가운데 기준으로 셀들이 중앙 정렬되도록 x 위치 계산
        [n * cellSize + 0.5 * width - 0.5 * cellsPerRow * cellSize, 0],
        [cellSize, cellSize]
      )
    );
  }
  // 첫 줄 셀들의 좌우 이웃 설정
  cells.forEach((cell, idx) => {
    cell.setNeighbors(cells[idx - 1], cells[idx + 1]);
  });
  console.log(cells);
  cells[Math.floor(cellsPerRow / 2)].state = true;

  for (let gen = 1; gen < Math.floor(height / cellSize); gen++) {
    createNextGen();
  }
}

// 아래 줄 한 줄을 만들어서 cells 배열에 이어 붙이는 함수
function createNextGen() {
  const idxBegin = cells.length - cellsPerRow;

  //  각 셀에 대해 nextState 계산하고
  //    그 값을 가진 새로운 셀을 아래 줄에 추가
  for (let n = 0; n < cellsPerRow; n++) {
    idx = idxBegin + n;
    cells[idx].computeNextState();
    cells.push(
      new Cell(
        [cells[idx].pos[0], cells[idx].pos[1] + cellSize],
        [cellSize, cellSize],
        cells[idx].nextState
      )
    );
  }
  // 방금 추가한 새 줄 셀들의 좌우 이웃 다시 설정
  for (let idx = cells.length - cellsPerRow; idx < cells.length; idx++) {
    cells[idx].setNeighbors(cells[idx - 1], cells[idx + 1]);
  }
}

// 매 프레임마다 화면을 다시 그리는 함수
function draw() {
  background(200);

  cells.forEach((cell) => cell.render(hoveredCell === cell));

  // 현재 룰을 8자리 2진수 문자열로 만들어 화면에 표시
  let ruleString = '';
  for (let idx = 0; idx < 8; idx++) {
    const key = idx.toString(2).padStart(3, '0');
    ruleString += Cell.rule[key];
  }
  fill('red');
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Rule: ${ruleString}`, 10, 10);
}

function mouseMoved() {
  hoveredCell = null;
  for (let idx = 0; idx < cellsPerRow; idx++) {
    if (cells[idx].isHovered(mouseX, mouseY)) {
      hoveredCell = cells[idx];
    }
  }
}

function mousePressed() {
  if (hoveredCell) {
    hoveredCell.toggleState();
  }
  // 전체 셀에 대해 nextState를 다시 계산하고,
  // 바로 아래 줄 셀의 state를 nextState로 반영
  cells.forEach((cell, idx) => {
    cell.computeNextState();
    if (cells[idx + cellsPerRow]) {
      cells[idx + cellsPerRow].state = cell.nextState;
    }
  });
}

function keyPressed() {
  if (key === 'ArrowLeft') {
    // 현재 룰을 2진수 문자열로 얻기
    let ruleString = '';
    for (let idx = 0; idx < 8; idx++) {
      const key = idx.toString(2).padStart(3, '0');
      ruleString += Cell.rule[key];
    }
    // 2진수 → 10진수
    const ruleNum = parseInt(ruleString, 2);
    if (ruleNum === 0) return;
    const newRuleNum = (ruleNum - 1) % 256;
    const newRuleString = newRuleNum.toString(2).padStart(8, '0');
    Cell.setRule(newRuleString);
    // 새 룰 기준으로 nextState 계산 후, 아래 줄 상태에 반영
    cells.forEach((cell, idx) => {
      cell.computeNextState();
      if (cells[idx + cellsPerRow]) {
        cells[idx + cellsPerRow].state = cell.nextState;
      }
    });
  } else if (key === 'ArrowRight') {
    let ruleString = '';
    for (let idx = 0; idx < 8; idx++) {
      const key = idx.toString(2).padStart(3, '0');
      ruleString += Cell.rule[key];
    }
    const ruleNum = parseInt(ruleString, 2);
    if (ruleNum === 255) return;
    const newRuleNum = (ruleNum + 1) % 256;
    const newRuleString = newRuleNum.toString(2).padStart(8, '0');
    Cell.setRule(newRuleString);
    // 새 룰 기준으로 nextState 계산 후, 아래 줄 상태에 반영
    cells.forEach((cell, idx) => {
      cell.computeNextState();
      if (cells[idx + cellsPerRow]) {
        cells[idx + cellsPerRow].state = cell.nextState;
      }
    });
  }
}
