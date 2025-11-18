const element = document.querySelector('#matter-box');
const width = 600;
const height = 400;

// Matter.뭐시기저시기
const {
  Engine,
  Render,
  Runner,
  Composites,
  Common,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

// create engine
const engine = Engine.create(),
  world = engine.world;

// create renderer
const render = Render.create({
  element,
  engine: engine,
  options: {
    width: width,
    height: height,
    // 렌더한테 준 옵션-빨간 선
    showAngleIndicator: true,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
// Composites: 여러개로 만들어줌
// Matter.Composites.stack(x, y, columns, rows, columnGap, rowGap, callback) → Composite
var stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
  var sides = Math.round(Common.random(1, 8));

  // round the edges of some bodies
  var chamfer = null;
  if (sides > 2 && Common.random() > 0.7) {
    chamfer = {
      radius: 10,
    };
  }

  switch (Math.round(Common.random(0, 1))) {
    case 0:
      if (Common.random() < 0.8) {
        return Bodies.rectangle(
          x,
          y,
          Common.random(25, 50),
          Common.random(25, 50),
          { chamfer: chamfer }
        );
      } else {
        return Bodies.rectangle(
          x,
          y,
          Common.random(80, 120),
          Common.random(25, 30),
          { chamfer: chamfer }
        );
      }
    case 1:
      return Bodies.polygon(x, y, sides, Common.random(25, 50), {
        chamfer: chamfer,
      });
  }
});
// 월드 구성용도
Composite.add(world, stack);
// 벽치는 용도
Composite.add(world, [
  // walls
  Bodies.rectangle(width * 0.5, 0, width, 50, { isStatic: true }),
  Bodies.rectangle(width * 0.5, height, width, 50, { isStatic: true }),
  Bodies.rectangle(width, height * 0.5, 50, height, { isStatic: true }),
  Bodies.rectangle(0, height * 0.5, 50, height, { isStatic: true }),
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
// 랜더에 맞춰서 크기 조절 해줌
// Render.lookAt(render, {
//   min: { x: 0, y: 0 },
//   max: { x: 800, y: 600 },
// });
