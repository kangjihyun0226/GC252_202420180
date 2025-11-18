// html 위치 찾기
const elem = document.querySelector('#matter-box');
console.log(elem);
// module aliases
// 랜더하는 엔진, 물체에 체:body, Composite:말줄이기
// const Engine = Matter.Engine,
//   Render = Matter.Render,
//   Runner = Matter.Runner,
//   Bodies = Matter.Bodies,
//   Composite = Matter.Composite;
// react가 쓰기 좋음

const { Engine, Render, Runner, Bodies, Composite } = Matter;

// create an engine
const engine = Engine.create();

// create a renderer
// 페이지에 js 위치를 바꿔줄 수 있음
const render = Render.create({
  element: elem,
  engine: engine,
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 100, 80);
const boxB = Bodies.rectangle(450, 50, 80, 120);
// x,y 는 사각형의 중앙점, isStatic: true: 사물 고정시키기
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world: 공간
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
