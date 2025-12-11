// 기본설정
const canvasContainer = document.getElementById('canvas-container');
let renderer;

const INITIAL_W = 400;
const INITIAL_H = 400;
const INITIAL_RATIO = INITIAL_W / INITIAL_H;

const {
  Engine,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

let stack;
let walls;
let engine;
let world;
let secondBalls = [];
let secondR = 8;
let minuteBalls = [];
let minuteR = 16;
let hourBalls = [];
let hourR = 32;

function setup() {
  // 기본 설정
  renderer = createCanvas(INITIAL_W, INITIAL_H);
  renderer.parent(canvasContainer);
  renderer.elt.style.aspectRatio = `${INITIAL_W} / ${INITIAL_H}`;

  new ResizeObserver(() => {
    const { width: containerWidth, height: containerHeight } =
      canvasContainer.getBoundingClientRect();
    renderer.elt.style.width = `${containerWidth}px`;
    renderer.elt.style.height = `${containerWidth / INITIAL_RATIO}px`;
  }).observe(canvasContainer);

  engine = Engine.create();
  world = engine.world;

  walls = [
    // 밑 벽
    Bodies.rectangle(0.5 * width, height, width, 50, { isStatic: true }),
    // 왼 벽
    Bodies.rectangle(0, 0.5 * height, 50, height, { isStatic: true }),
    // 오른 벽
    Bodies.rectangle(width, 0.5 * height, 50, height, { isStatic: true }),
  ];

  // 생성된 벽들 추가
  Composite.add(world, walls);

  const mouse = Mouse.create(renderer.elt);
  mouse.pixelRatio = pixelDensity();

  // 마우스로 드래그
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
    },
  });

  // 마우스 추가
  Composite.add(world, mouseConstraint);

  // 엔진 실행
  const runner = Runner.create();
  // 러너를 시작하고 엔진에 연결합니다. 이제 시뮬레이션이 자동으로 업데이트됩니다.
  Runner.run(runner, engine);

  // help..
  // 현재 시각에 맞춰 초기 공 생성
  const currentSecond = second();
  const currentMinute = minute();
  const currentHour = hour() % 12 === 0 ? 12 : hour() % 12;
  ////////////////////////// ↑           ↑      ↑
  ////////////////////   만약 0이면?   12로   아니면 그대로

  // 초 공 생성
  for (let i = 0; i < currentSecond; i++) {
    dropSBall();
  }
  // 분 공 생성
  for (let i = 0; i < currentMinute; i++) {
    dropMBall();
  }
  // 시 공 생성
  for (let i = 0; i < currentHour; i++) {
    dropHBall();
  }
}

// 초 공을 떨어뜨리는 함수
function dropSBall() {
  const sBall = Bodies.circle(width * 0.5, 0, secondR);
  secondBalls.push(sBall);
  Composite.add(world, sBall);
}

// 분 공을 떨어뜨리는 함수
function dropMBall() {
  const mBall = Bodies.circle(width * 0.5, 0, minuteR);
  minuteBalls.push(mBall);
  Composite.add(world, mBall);
}

// 시 공을 떨어뜨리는 함수
function dropHBall() {
  const hBall = Bodies.circle(width * 0.5, 0, hourR);
  hourBalls.push(hBall);
  Composite.add(world, hBall);
}

// 시계 바늘을 그리는 함수
function drawTimeHand(angleDegrees, length, colour, weight) {
  push();
  translate(width * 0.5, height * 0.5);
  rotate(radians(angleDegrees));
  stroke(colour);
  strokeWeight(weight);
  line(0, 0, 0, -length);
  pop();
}

// 시간을 각도로 변환하는 함수
function timeToDegrees(time, range) {
  // 0~360도
  return map(time, 0, range, 0, 360);
}

function draw() {
  background('#001F3D');

  // 현재 시각 가져오기
  const currentSecond = second();
  const currentMinute = minute();
  const currentHour = hour() % 12 === 0 ? 12 : hour() % 12;

  // 초 공 개수 동기화 (0~59초)
  if (secondBalls.length < currentSecond) {
    dropSBall();
  } else if (secondBalls.length > currentSecond) {
    // 60초 -> 0초로 넘어갈 때 모든 초 공 제거
    const ballToRemove = secondBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  // 분 공 개수 동기화 (0~59분)
  if (minuteBalls.length < currentMinute) {
    dropMBall();
  } else if (minuteBalls.length > currentMinute) {
    // 60분 -> 0분으로 넘어갈 때 모든 분 공 제거
    const ballToRemove = minuteBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  // 시 공 개수 동기화 (1~12시)
  if (hourBalls.length < currentHour) {
    dropHBall();
  } else if (hourBalls.length > currentHour) {
    // 12시 -> 1시로 넘어갈 때 시 공 제거
    const ballToRemove = hourBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  noStroke();
  noFill(); // 채우기 없음

  // 벽 렌더링
  walls.forEach((aBody) => {
    beginShape(); // 다각형 그리기 시작
    // 벽 바디의 꼭짓점을 순회합니다.
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    // 다각형을 닫고 그리기 종료 (경계 벽을 흰색 윤곽선으로 그립니다)
    endShape(CLOSE);
  });

  // 공 렌더링
  noStroke();
  fill('#E6E6E6');
  secondBalls.forEach((ball) => {
    circle(ball.position.x, ball.position.y, secondR * 2);
  });
  fill('#F7B980');
  minuteBalls.forEach((ball) => {
    circle(ball.position.x, ball.position.y, minuteR * 2);
  });
  fill('#ED985F');
  hourBalls.forEach((ball) => {
    circle(ball.position.x, ball.position.y, hourR * 2);
  });
  // hour() % 12은 24시간을 12시간으로 변환
  let hAngleDeg = timeToDegrees(hour() % 12, 12);
  let mAngleDeg = timeToDegrees(minute(), 60);
  let sAngleDeg = timeToDegrees(second(), 60);

  drawTimeHand(hAngleDeg, width * 0.3, '#ED985F', 5);
  drawTimeHand(mAngleDeg, width * 0.4, '#F7B980', 5);
  drawTimeHand(sAngleDeg, width * 0.48, '#E6E6E6', 3);
}
