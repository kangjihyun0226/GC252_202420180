// 개별 타일을 표현하는 클래스
class Tile {
  pos = [0, 0];
  size = [1, 1];
  neighbors = [null, null, null, null];
  // t,l,b,r
  state = false;
  binaryState = '0000';
  tileImgIdx = 0;

  // x, y: 위치, w, h: 크기, state: 초기 on/off 상태
  constructor(x, y, w, h, state = false) {
    this.pos[0] = x;
    this.pos[1] = y;
    this.size[0] = w;
    this.size[1] = h;
    this.state = state;
  }
  // 위, 왼쪽, 아래, 오른쪽 이웃 타일을 한 번에 세팅
  setNeighbor(t, l, b, r) {
    this.neighbors[0] = t;
    this.neighbors[1] = l;
    this.neighbors[2] = b;
    this.neighbors[3] = r;
  }

  // 이웃들의 state를 읽어서 이진수 문자열을 만들고
  // 그것을 10진수로 바꿔 tileImgIdx에 저장
  computeStates() {
    let binaryString = '';
    this.neighbors.forEach((aNeighbor) => {
      // if (aNeighbor) {
      //   binaryString += aNeighbor.state ? '1' : '0';
      // } else {
      //   binaryString += '0';
      // }
      binaryString += aNeighbor?.state ? '1' : '0';
    });
    this.tileImgIdx = parseInt(binaryString, 2);
  }

  isHovered(mx, my) {
    return (
      mx >= this.pos[0] &&
      mx <= this.pos[0] + this.size[0] &&
      my >= this.pos[1] &&
      my <= this.pos[1] + this.size[1]
    );
  }
  // 타일 상태 on/off 토글
  toggleState() {
    this.state = !this.state;
  }

  render(tiles) {
    const [x, y] = this.pos;
    const [w, h] = this.size;
    const cx = x + w / 2;
    const cy = y + h / 2;

    // state가 true일 때만 타일 이미지를 그림
    if (this.state) {
      image(
        tiles[this.tileImgIdx],
        this.pos[0],
        this.pos[1],
        this.size[0],
        this.size[1]
      );
    }
    push();
    translate(cx, cy);
    if (this.state) {
      fill('white');
      circle(0, 0, w / 4);
    }
    fill('red');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.binaryState.charAt(0), 0, -h / 3);
    text(this.binaryState.charAt(1), -w / 3, 0);
    text(this.binaryState.charAt(2), 0, h / 3);
    text(this.binaryState.charAt(3), w / 3, 0);

    pop();
  }
}
