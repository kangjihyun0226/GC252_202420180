const canvasContainer = document.getElementById('canvas-container');
let renderer;

const INITIAL_W = 800;
const INITIAL_H = 600;
const INITIAL_RATIO = INITIAL_W / INITIAL_H;

const cellsPerRow = 200;
let cellsPerColumn;
const cells = [];
let cellSize;

let hoveredCell = null;

// 0: 가위(빨강), 1: 바위(파랑), 2: 보(노랑)
const Colors = {
  // 빨강 (가위)
  0: '#FF4444',
  // 파랑 (바위)
  1: '#4444FF',
  // 노랑 (보)
  2: '#FFDD44',
};

function getIdx(r, c) {
  return r * cellsPerRow + c;
}

let lastTime = 0;
const interval = 80;

function setup() {
  renderer = createCanvas(INITIAL_W, INITIAL_H);
  renderer.parent(canvasContainer);
  renderer.elt.style.aspectRatio = `${INITIAL_W} / ${INITIAL_H}`;

  new ResizeObserver(() => {
    const { width: containerWidth, height: containerHeight } =
      canvasContainer.getBoundingClientRect();
    renderer.elt.style.width = `${containerWidth}px`;
    renderer.elt.style.height = `${containerWidth / INITIAL_RATIO}px`;
  }).observe(canvasContainer);

  cellSize = width / cellsPerRow;
  cellsPerColumn = Math.floor(height / cellSize);

  // 셀 생성
  for (let r = 0; r < cellsPerColumn; r++) {
    for (let c = 0; c < cellsPerRow; c++) {
      // 랜덤하게 가위(0), 바위(1), 보(2) 배치
      const randomState = Math.floor(Math.random() * 3);
      const newCell = new Cell(r, c, randomState);
      cells.push(newCell);
    }
  }

  // 이웃 셀 연결
  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / cellsPerRow);
    const col = idx % cellsPerRow;

    // 8방향 tl, t, tr, r, br, b, bl, l
    const tl = row > 0 && col > 0 ? cells[getIdx(row - 1, col - 1)] : null;
    const t = row > 0 ? cells[getIdx(row - 1, col)] : null;
    const tr =
      row > 0 && col < cellsPerRow - 1 ? cells[getIdx(row - 1, col + 1)] : null;
    const r = col < cellsPerRow - 1 ? cells[getIdx(row, col + 1)] : null;
    const br =
      row < cellsPerColumn - 1 && col < cellsPerRow - 1
        ? cells[getIdx(row + 1, col + 1)]
        : null;
    const b = row < cellsPerColumn - 1 ? cells[getIdx(row + 1, col)] : null;
    const bl =
      row < cellsPerColumn - 1 && col > 0
        ? cells[getIdx(row + 1, col - 1)]
        : null;
    const l = col > 0 ? cells[getIdx(row, col - 1)] : null;

    cell.setNeighbors(tl, t, tr, r, br, b, bl, l);
  });
}

//
function draw() {
  background(250);

  // 다음 상태 계산
  cells.forEach((aCell) => aCell.computeNextState());

  //실제 상태 반영
  if (millis() - lastTime > interval) {
    cells.forEach((aCell) => aCell.updateState());
    lastTime = millis();
  }

  // 렌더링
  cells.forEach((cell) => cell.render(cellSize, Colors));
}
