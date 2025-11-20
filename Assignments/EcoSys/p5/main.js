const showFlags = [false, false, false, false, true];

const evaders = [];
const numEvaders = 5;
const pursuers = [];
const numPursuers = 2;
const seed = 0;
let target;
let bubbles = [];

function setup() {
  createCanvas(1000, 600);
  randomSeed(seed);
  target = createVector(mouseX, mouseY);

  for (let i = 0; i < 20; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 50);
    let diameter = random(20, 50);
    let speed = random(1, 2);
    let colour = color('#FFF6E9');

    bubbles.push(new bubble(x, y, diameter, speed, colour));
  }

  // Evader 생성 (Animal 사용)
  for (let n = 0; n < numEvaders; n++) {
    const x = random(width);
    const y = random(height);

    const evader = new Evader(x, y, {
      maxSpeed: 4,
      maxForce: 0.1,
    });

    const animal = new Animal(
      x,
      y,
      4,
      [radians(170), radians(190)],
      [25, 30, 35, 38, 40, 38, 35, 30, 25, 20, 10, 5, 30]
    );

    evaders.push({ evader, animal });
  }

  // Pursuer 생성 (Animal2 사용)
  for (let n = 0; n < numPursuers; n++) {
    const x = random(width);
    const y = random(height);

    const pursuer = new Pursuer(x, y, {
      maxSpeed: 3,
      maxForce: 0.05,
    });

    const animal = new Animal2(
      x,
      y,
      8,
      [radians(170), radians(190)],
      [
        20, 30, 40, 50, 60, 80, 100, 120, 140, 150, 155, 160, 140, 120, 100, 60,
        55, 50, 25, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      ]
    );

    pursuers.push({ pursuer, animal });
  }
}

function draw() {
  background('#80C4E9');

  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].resolveWallCollision();
    bubbles[i].show();
  }

  // Evaders (피식자) 업데이트
  for (const fish of evaders) {
    if (mouseIsPressed) {
      target.set(mouseX, mouseY);
    }

    fill('#A16D28');
    noStroke();
    circle(target.x, target.y, 16);
    fish.evader.seek(target);

    fish.evader.update();

    // pursuers의 pursuer만 추출
    const pursuerObjects = pursuers.map((p) => p.pursuer);
    fish.evader.evade(pursuerObjects);

    // evaders의 evader만 추출
    const evaderObjects = evaders.map((e) => e.evader);
    fish.evader.separate(evaderObjects);

    fish.evader.wrapCoordinates();

    // Animal 동기화 및 표시
    fish.animal.setHeadPos(fish.evader.pos);
    fish.animal.update();

    if (showFlags[0]) fish.animal.showSpine();
    if (showFlags[1]) fish.animal.showDistConstraint();
    if (showFlags[2]) fish.animal.showThickness();
    if (showFlags[3]) {
      fish.animal.showPtOnThicknessCW();
      fish.animal.showPtOnThicknessCCW();
    }
    if (showFlags[4]) {
      fish.animal.showBodyShape();
      fish.animal.showEyes();
      fish.animal.showFin();
    }
  }

  // Pursuers (포식자) 업데이트
  for (const fish of pursuers) {
    fish.pursuer.update();

    // evaders의 evader만 추출해서 추적
    const evaderObjects = evaders.map((e) => e.evader);
    fish.pursuer.pursue(evaderObjects);

    // pursuers의 pursuer만 추출
    const pursuerObjects = pursuers.map((p) => p.pursuer);
    fish.pursuer.separate(pursuerObjects);

    fish.pursuer.wrapCoordinates();

    // Animal2 동기화 및 표시
    fish.animal.setHeadPos(fish.pursuer.pos);
    fish.animal.update();

    if (showFlags[0]) fish.animal.showSpine();
    if (showFlags[1]) fish.animal.showDistConstraint();
    if (showFlags[2]) fish.animal.showThickness();
    if (showFlags[3]) {
      fish.animal.showPtOnThicknessCW();
      fish.animal.showPtOnThicknessCCW();
    }
    if (showFlags[4]) {
      fish.animal.showBodyShape();
      fish.animal.showEyes();
    }

    // 타겟 라인 표시 (선택적)
    // fish.pursuer.showTarget();
  }
}
