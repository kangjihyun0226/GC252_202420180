const {
  Engine, // 물리 시뮬레이션 엔진을 생성하고 관리
  Runner, // 엔진을 일정한 속도로 실행
  Composites, // 복합 바디(여러 바디의 집합)를 생성
  MouseConstraint, // 마우스와 상호작용하는 제약 조건
  Mouse, // 마우스 입력 처리
  Composite, // 바디, 제약 조건 등을 담는 컨테이너
  Bodies, // 기본 물리 바디(사각형, 원 등)를 생성
} = Matter;

let stack; // Matter.js 바디들의 스택(쌓인 물체들)을 저장할 변수
let walls; // 경계 벽(static 바디)들을 저장할 변수

const canvasContainer = document.getElementById('canvas-container');

function setup() {
  const renderer = createCanvas(800, 600);
  renderer.parent(canvasContainer); // 물리 엔진을 생성합니다.

  const engine = Engine.create(),
    world = engine.world; // 엔진의 월드(물리 공간) 참조 // 1. 바디 스택 생성 (떨어질 물체들)

  stack = Composites.stack(
    20, // 시작 X 좌표
    20, // 시작 Y 좌표
    10, // 열 개수
    5, // 행 개수
    0, // 열 간 간격 (가로 간격)
    0, // 행 간 간격 (세로 간격)
    (x, y) => {
      // 각 셀 위치(x, y)에 바디를 생성하는 콜백 함수
      if (random() < 0.8) {
        // 80% 확률로 작은 사각형 바디 생성
        return Bodies.rectangle(x, y, random(25, 50), random(25, 50));
      } else {
        // 20% 확률로 길쭉한 사각형 바디 생성
        return Bodies.rectangle(x, y, random(80, 120), random(25, 30));
      }
    }
  ); // 생성된 스택을 월드에 추가합니다.
  Composite.add(world, stack); // 2. 경계 벽 생성 (Static 바디)

  walls = [
    // 상단 벽: (캔버스 중앙, 0), 너비, 높이 50, 움직이지 않음(isStatic: true)
    Bodies.rectangle(0.5 * width, 0, width, 50, { isStatic: true }), // 하단 벽: (캔버스 중앙, 캔버스 높이), 너비, 높이 50, 움직이지 않음
    Bodies.rectangle(0.5 * width, height, width, 50, { isStatic: true }), // 좌측 벽: (0, 캔버스 중앙), 너비 50, 높이, 움직이지 않음
    Bodies.rectangle(0, 0.5 * height, 50, height, { isStatic: true }), // 우측 벽: (캔버스 너비, 캔버스 중앙), 너비 50, 높이, 움직이지 않음
    Bodies.rectangle(width, 0.5 * height, 50, height, { isStatic: true }),
  ]; // 생성된 벽들을 월드에 추가합니다.
  Composite.add(world, walls); // 디버깅 목적으로 콘솔에 생성된 바디 정보를 출력합니다.

  console.log(stack);
  console.log(walls); // 3. 마우스 상호작용 설정 // p5.js 캔버스 요소를 사용하여 마우스 객체를 생성합니다.

  const mouse = Mouse.create(renderer.elt); // 고해상도 디스플레이를 위한 픽셀 비율을 설정합니다. (p5.js의 pixelDensity() 사용)
  mouse.pixelRatio = pixelDensity(); // 마우스 제약 조건(MouseConstraint)을 생성하여 마우스로 바디를 드래그할 수 있게 합니다.
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2, // 드래그 시 제약 조건의 강도
    },
  }); // 마우스 제약 조건을 월드에 추가합니다.
  Composite.add(world, mouseConstraint); // 4. 엔진 실행 (시뮬레이션 시작) // 러너(Runner)를 생성합니다. 러너는 엔진 업데이트를 루프로 실행합니다.

  const runner = Runner.create(); // 러너를 시작하고 엔진에 연결합니다. 이제 시뮬레이션이 자동으로 업데이트됩니다.
  Runner.run(runner, engine);
}

function draw() {
  // 배경을 검은색으로 칠합니다.
  background(0);
  // 중앙의 고정된 원을 그립니다. (물리 엔진과 관련 없는 순수 p5.js 그림)

  noStroke();
  fill('red');
  circle(width / 2, height / 2, 100); // 캔버스 중앙에 지름 100의 원 // Matter.js 바디들을 렌더링합니다.

  stroke('white'); // 윤곽선 흰색
  noFill(); // 채우기 없음 // 1. 스택 바디 렌더링

  stack.bodies.forEach((aBody) => {
    beginShape(); // 다각형 그리기 시작 // 바디의 모든 꼭짓점(vertices)을 순회하며 p5.js의 vertex로 좌표를 찍습니다.
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    }); // 다각형을 닫고 그리기 종료 (사각형을 흰색 윤곽선으로 그립니다)
    endShape(CLOSE);
  }); // 2. 벽 바디 렌더링

  walls.forEach((aBody) => {
    beginShape(); // 다각형 그리기 시작 // 벽 바디의 꼭짓점을 순회합니다.
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    }); // 다각형을 닫고 그리기 종료 (경계 벽을 흰색 윤곽선으로 그립니다)
    endShape(CLOSE);
  });
}
