class Cell {
  constructor(row, col, state) {
    this.row = row;
    this.col = col;
    this.state = state; // 0은 가위(빨강), 1은 바위(파랑), 2는 보(노랑)
    this.nextState = state;
    this.neighbors = [null, null, null, null, null, null, null, null];
  }

  setNeighbors(tl, t, tr, r, br, b, bl, l) {
    this.neighbors[0] = tl;
    this.neighbors[1] = t;
    this.neighbors[2] = tr;
    this.neighbors[3] = r;
    this.neighbors[4] = br;
    this.neighbors[5] = b;
    this.neighbors[6] = bl;
    this.neighbors[7] = l;
  }

  computeNextState() {
    if (this.neighbors.length === 0) return;

    // 이웃 중 랜덤으로 하나 선택
    const randomNeighbor = random(this.neighbors);
    if (!randomNeighbor) return;

    const myState = this.state;
    const opState = randomNeighbor.state;

    // 가위바위보 규칙
    // 가위(0)는 보(2)를 이김
    // 바위(1)는 가위(0)를 이김
    // 보(2)는 바위(1)를 이김

    // help
    if (myState === 0 && opState === 1) {
      this.nextState = 1; // 바위가 가위를 이김
    } else if (myState === 1 && opState === 2) {
      this.nextState = 2; // 보가 바위를 이김
    } else if (myState === 2 && opState === 0) {
      this.nextState = 0; // 가위가 보를 이김
    }
    // 같은 상태거나 내가 이기면 변화 없음
  }

  updateState() {
    this.state = this.nextState;
  }

  render(cellSize, colors) {
    fill(colors[this.state]);
    noStroke();
    rect(this.col * cellSize, this.row * cellSize, cellSize, cellSize);
  }
}
