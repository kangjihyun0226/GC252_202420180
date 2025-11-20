class Cell {
  pos = [0, 0];
  size = [0, 0];
  state = false;
  left = null;
  right = null;
  nextState = false;
  static rule = {
    '000': 1,
    '001': 1,
    '010': 0,
    '011': 0,
    100: 1,
    101: 0,
    110: 0,
    111: 0,
  };
  // 규칙 문자열(8자리)로 rule 객체 업데이트
  static setRule(ruleString) {
    for (let idx = 0; idx < 8; idx++) {
      const key = idx.toString(2).padStart(3, '0');
      Cell.rule[key] = parseInt(ruleString.charAt(idx), 10);
    }
  }

  // 생성자: 위치·크기·초기상태 입력받아 셀 생성
  constructor(pos, size, state = false) {
    this.pos = pos;
    this.size = size;
    this.state = state;
  }

  // (왼/가운데/오른쪽) 상태를 '010' 같은 3비트 문자열로 반환
  setNeighbors(left, right) {
    this.left = left;
    this.right = right;
  }

  // rule에 따라 다음 상태 계산 후 nextState에 저장
  getCombinedStates() {
    return `${this.left ? (this.left.state ? '1' : '0') : '0'}${
      this.state ? '1' : '0'
    }${this.right ? (this.right.state ? '1' : '0') : '0'}`;
  }

  // 클릭 등으로 상태 반전
  computeNextState() {
    const combinedStates = this.getCombinedStates();
    this.nextState = Cell.rule[combinedStates] === 1;
  }

  toggleState() {
    this.state = !this.state;
  }

  isHovered(mouseX, mouseY) {
    return (
      mouseX >= this.pos[0] &&
      mouseX < this.pos[0] + this.size[0] &&
      mouseY >= this.pos[1] &&
      mouseY < this.pos[1] + this.size[1]
    );
  }
  // 셀그리기
  render(isHovered = false) {
    if (isHovered) {
      stroke('red');
    } else {
      stroke('black');
    }
    if (this.state) {
      fill('black');
    } else {
      noFill();
    }
    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
  }
}
