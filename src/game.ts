import * as GUI from '@babylonjs/gui';
import * as BABYLON from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials/sky';


import * as CONSTANTS from './constants';
import { inputMap, registerInput } from './input';
import { createUI, showWinPopup, createSettingsMenu } from './ui';
import { Theme, blueTheme } from './themes';
import { onThemeChange, stateSelectedTheme } from './state';

export let gameStarted = false;
export let gamePaused = false;
export let leftScore = 0, rightScore = 0;
export let spaceHandled = false;
export let speed = CONSTANTS.INITIAL_BALL_SPEED;
export let velocity = new BABYLON.Vector3(speed, speed, 0);
export let selectedTheme = blueTheme;

let ball: BABYLON.Mesh;
let settings = JSON.parse(localStorage.getItem('pongSettings')) || CONSTANTS.DEFAULTS;
let dt: BABYLON.DynamicTexture;

// HELPER FUNCTIONS
export function setGameStarted(value: boolean) {
  gameStarted = value;
}

export function setGamePaused(value: boolean) {
  gamePaused = value;
}

export function isGameStarted() {
  return gameStarted;
}

export function isGamePaused() {
  return gamePaused;
}

export function setLeftScore(value: number) {
  leftScore = value;
}

export function setRightScore(value: number) {
  rightScore = value;
}

export function setSpeed(value: number) {
  speed = value;
}

export function setVelocity(value: BABYLON.Vector3) {
  velocity = value;
}

export function reset(dir) {
  ball.position.set(0, 0, 0);
  const baseSpeed = speed;

  const angle = (Math.random() - 0.5) * Math.PI / 3; // ±30 degrees
  const vx = Math.cos(angle) * baseSpeed * dir;
  const vy = Math.sin(angle) * baseSpeed;

  velocity = new BABYLON.Vector3(vx, vy, 0);
}

export function updateScoreTexture(text) {
  const ctx = dt.getContext();
  const { width, height } = dt.getSize();

  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  dt.drawText(text, width / 2, height / 2 + 20,
    "bold 72px Valorant, sans-serif", "white", "transparent", true
  );
}

function applyThemeToGame(scene: BABYLON.Scene, theme: Theme, objects: {
  ball: BABYLON.Mesh,
  leftPaddle: BABYLON.Mesh,
  rightPaddle: BABYLON.Mesh,
  particleSystem: BABYLON.ParticleSystem,
  gridMat: BABYLON.StandardMaterial
}) {
  // Fog color
  scene.fogColor = theme.fogColor ?? new BABYLON.Color3(0, 0, 0);

  // Ball material
  const ballMat = objects.ball.material as BABYLON.StandardMaterial;
  if (ballMat) {
    ballMat.emissiveColor = theme.ballColor ?? new BABYLON.Color3(1, 1, 1);
  }

  // Paddles
  [objects.leftPaddle, objects.rightPaddle].forEach(paddle => {
    const mat = paddle.material as BABYLON.StandardMaterial;
    if (mat) {
      mat.emissiveColor = theme.paddleColor ?? new BABYLON.Color3(0.6, 0.6, 0.6);
    }
  });

  // Particles
  if (objects.particleSystem) {
    objects.particleSystem.color1 = theme.trailColor1 ?? new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
    objects.particleSystem.color2 = theme.trailColor2 ?? new BABYLON.Color4(0.0, 0.5, 1.0, 1.0);
    objects.particleSystem.colorDead = theme.trailDeadColor ?? new BABYLON.Color4(0, 0, 0, 0);
  }

  // Grid
  if (objects.gridMat) {
    objects.gridMat.emissiveColor = theme.gridColor ?? new BABYLON.Color3(0.2, 0.6, 0.8);
  }

  // Sun - not done yet
  if (theme.name === 'Orange') {
    addSun(scene);
  }
  else if (theme.name === 'Blue') {
    addMoon(scene);
  }
}

function addSun(scene: BABYLON.Scene) {
  //     const skyMaterial = new SkyMaterial("skyMaterial", scene);
  // skyMaterial.backFaceCulling = false;
}

function addMoon(scene: BABYLON.Scene) {

}

export function createGameScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
  const scene = new BABYLON.Scene(engine);

  // Fog for volumetric haze
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
  scene.fogColor = new BABYLON.Color3(0.05, 0.1, 0.15);
  scene.fogDensity = 0.02;

  // Glow layer for subtle bloom
  const glow = new BABYLON.GlowLayer("glow", scene);
  glow.intensity = 0.3;

  const { startButton, winPopup, winText, settingsPanel, playAgainButton } = createUI(scene);
  registerInput(scene);

  // CAMERA - original display
  // const camera = new BABYLON.ArcRotateCamera(
  //   "cam", Math.PI / 2, Math.PI / 2,
  //   CONSTANTS.PADDLE_OFFSET_X * 4, BABYLON.Vector3.Zero(), scene
  // );
  const camera = new BABYLON.ArcRotateCamera(
    "cam", -30, 1.5,
    CONSTANTS.PADDLE_OFFSET_X, BABYLON.Vector3.Zero(), scene
  );
  camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
  camera.attachControl(canvas, true);
  camera.radius = 25;

  // LIGHT
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // SUNLIGHT
  const sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(-1, -2, -1), scene);
  sunLight.position = new BABYLON.Vector3(50, 100, 50);
  sunLight.intensity = 1.0;
  const sun = BABYLON.MeshBuilder.CreateSphere("sun", { diameter: 10 }, scene);
  sun.position = sunLight.position;

  const sunMat = new BABYLON.StandardMaterial("sunMat", scene);
  sunMat.emissiveColor = new BABYLON.Color3(1.0, 0.8, 0.0); // Sun yellow
  sun.material = sunMat;
  const glowLayer = new BABYLON.GlowLayer("glow", scene);
  glowLayer.intensity = 0.8;
  const lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", sun, scene);

  new BABYLON.LensFlare(0.5, 0, new BABYLON.Color3(1, 1, 0.8), "https://assets.babylonjs.com/lensflare/lensflare0.png", lensFlareSystem);
  new BABYLON.LensFlare(0.2, 0.3, new BABYLON.Color3(1, 0.8, 0.5), "https://assets.babylonjs.com/lensflare/lensflare2.png", lensFlareSystem);
  new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "https://assets.babylonjs.com/lensflare/lensflare3.png", lensFlareSystem);

  // FIELD BOUNDS
  const halfW = CONSTANTS.FIELD_WIDTH / 2;
  const halfH = CONSTANTS.FIELD_HEIGHT / 2;
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.alpha = 0;
  const top = BABYLON.MeshBuilder.CreateBox(
    "topWall", { width: CONSTANTS.FIELD_WIDTH, height: CONSTANTS.WALL_THICKNESS, depth: CONSTANTS.WALL_THICKNESS }, scene
  );
  top.position.y = halfH + CONSTANTS.WALL_THICKNESS / 2;
  top.material = wallMat;
  const bottom = top.clone("bottomWall");
  bottom.position.y = -halfH - CONSTANTS.WALL_THICKNESS / 2;

  // BACK-WALL GRID: vertical ground with subdivisions
  const backWall = BABYLON.MeshBuilder.CreateGround("backWall", {
    width: CONSTANTS.FIELD_WIDTH,
    height: CONSTANTS.FIELD_HEIGHT,
    subdivisions: 20
  }, scene);
  backWall.rotation.x = Math.PI / 2;  // make vertical
  backWall.position.z = -CONSTANTS.PADDLE_OFFSET_X - 0.1;
  const gridMat = new BABYLON.StandardMaterial("gridMat", scene);
  gridMat.backFaceCulling = false;
  gridMat.emissiveColor = new BABYLON.Color3(0.2, 0.6, 0.8);
  gridMat.alpha = 0.5;
  gridMat.wireframe = true;
  backWall.material = gridMat;

  // Under-light to accentuate the grid
  const underLight = new BABYLON.PointLight(
    "under", new BABYLON.Vector3(0, -0.1, 0), scene
  );
  underLight.range = CONSTANTS.FIELD_WIDTH;
  underLight.intensity = 0.5;
  underLight.diffuse = new BABYLON.Color3(0.1, 0.5, 0.7);

  // PADDLES
  const paddleOpts = { width: CONSTANTS.PADDLE_WIDTH, height: CONSTANTS.PADDLE_HEIGHT, depth: CONSTANTS.PADDLE_DEPTH };
  const leftPaddle = BABYLON.MeshBuilder.CreateBox("leftPaddle", paddleOpts, scene);
  leftPaddle.position.x = -CONSTANTS.PADDLE_OFFSET_X;
  const rightPaddle = leftPaddle.clone("rightPaddle");
  rightPaddle.position.x = CONSTANTS.PADDLE_OFFSET_X;

  // BALL
  ball = BABYLON.MeshBuilder.CreateSphere(
    "ball", { diameter: CONSTANTS.BALL_DIAMETER }, scene
  );
  ball.position.set(0, 0, 0);

  //let ballVelocity = new BABYLON.Vector3(CONSTANTS.INITIAL_BALL_SPEED, CONSTANTS.INITIAL_BALL_SPEED, 0);

  // PARTICLE EFFECTS FOR THE BALL
  const particleSystem = new BABYLON.ParticleSystem("ballTrail", 2000, scene);

  // Use a built-in texture
  particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", scene);

  // Emit from the ball
  particleSystem.emitter = ball;

  // Emit from a small box behind the ball
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);

  // Colors
  particleSystem.color1 = new BABYLON.Color4(0.2, 0.6, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.0, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // Size and lifetime
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.3;
  particleSystem.minLifeTime = 0.2;
  particleSystem.maxLifeTime = 0.4;

  // Emission rate
  particleSystem.emitRate = 100;

  // Speed
  particleSystem.minEmitPower = 0.5;
  particleSystem.maxEmitPower = 1.0;
  particleSystem.updateSpeed = 0.02;

  // Start the particle system
  particleSystem.start();

  onThemeChange((theme) => {
    applyThemeToGame(scene, theme, {
      ball,
      leftPaddle,
      rightPaddle,
      particleSystem,
      gridMat
    });
  });

  // Holographic materials
  [leftPaddle, rightPaddle, ball].forEach(mesh => {
    const holoMat = new BABYLON.StandardMaterial("holo", scene);
    holoMat.alpha = 0.3;
    holoMat.emissiveColor = new BABYLON.Color3(0.1, 0.6, 0.9);
    holoMat.disableLighting = true;
    mesh.material = holoMat;
  });

  // SCOREBOARD PLANE
  const scorePlane = BABYLON.MeshBuilder.CreatePlane("scorePlane", { width: 4, height: 1 }, scene);
  scorePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  scorePlane.position.set(
    0,
    halfH + 1,
    0
  );

  // DynamicTexture for text
  dt = new BABYLON.DynamicTexture("dt", { width: 512, height: 128 }, scene, false);
  dt.hasAlpha = true;
  const scoreMat = new BABYLON.StandardMaterial("scoreMat", scene);
  scoreMat.diffuseTexture = dt;
  scoreMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
  scoreMat.disableLighting = true;
  scorePlane.material = scoreMat;

  updateScoreTexture("0 : 0");

  function showWinPopup(winner) {
    winText.text = winner + " Player Wins!";
    winPopup.isVisible = true;
    gamePaused = true;
    gameStarted = false;
  }

  const uiRefs = createSettingsMenu(scene, {
    velocity: velocity,
    winPopup: winPopup,
    startButton: startButton,
    setGamePaused: (paused) => { gamePaused = paused; },
    setGameStarted: (started) => { gameStarted = started; },
    loadMap: (mapName) => { /* map loading logic here */ },
    getVelocity: () => velocity,
    setVelocity: (v) => { velocity = v; },
    getSpeed: () => speed,
    setSpeed: (v) => { speed = v; },
    gameStarted: gameStarted,
    playAgainButton: playAgainButton
  });



  // MAIN LOOP
  scene.onBeforeRenderObservable.add(() => {
    // 1. Toggle pause when Space is pressed:
    if (inputMap[" "] && !spaceHandled && gameStarted) {
      gamePaused = !gamePaused;
      spaceHandled = true;
    }
    if (!inputMap[" "]) {
      spaceHandled = false;
    }

    // 2. Skip movement while not started or when paused:
    if (!gameStarted || gamePaused) {
      return;
    }

    // Paddle movement
    if (inputMap["w"] && rightPaddle.position.y < halfH - CONSTANTS.PADDLE_HEIGHT / 2) rightPaddle.position.y += CONSTANTS.PADDLE_MOVE_STEP;
    if (inputMap["s"] && rightPaddle.position.y > -halfH + CONSTANTS.PADDLE_HEIGHT / 2) rightPaddle.position.y -= CONSTANTS.PADDLE_MOVE_STEP;
    if (inputMap["ArrowUp"] && leftPaddle.position.y < halfH - CONSTANTS.PADDLE_HEIGHT / 2) leftPaddle.position.y += CONSTANTS.PADDLE_MOVE_STEP;
    if (inputMap["ArrowDown"] && leftPaddle.position.y > -halfH + CONSTANTS.PADDLE_HEIGHT / 2) leftPaddle.position.y -= CONSTANTS.PADDLE_MOVE_STEP;

    // Ball trajectory
    const nextPos = ball.position.add(velocity);
    const maxY = halfH - CONSTANTS.BALL_DIAMETER / 2;
    if (nextPos.y > maxY || nextPos.y < -maxY) {
      velocity.y *= -1;
      nextPos.y = BABYLON.Scalar.Clamp(nextPos.y, -maxY, maxY);
    }

    // Particle movement
    particleSystem.direction1 = velocity.scale(-1);
    particleSystem.direction2 = velocity.scale(-1.2);


    // Paddle collision
    [leftPaddle, rightPaddle].forEach(p => {
      const dx = nextPos.x - p.position.x;
      const dy = nextPos.y - p.position.y;
      const overlapX = (CONSTANTS.PADDLE_WIDTH / 2 + CONSTANTS.BALL_DIAMETER / 2) - Math.abs(dx);
      const overlapY = (CONSTANTS.PADDLE_HEIGHT / 2 + CONSTANTS.BALL_DIAMETER / 2) - Math.abs(dy);
      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          velocity.x *= -CONSTANTS.BALL_SPEED_INCREMENT;
          nextPos.x = p.position.x + Math.sign(dx) * (CONSTANTS.PADDLE_WIDTH / 2 + CONSTANTS.BALL_DIAMETER / 2);
        } else {
          velocity.y *= -1;
          nextPos.y = p.position.y + Math.sign(dy) * (CONSTANTS.PADDLE_HEIGHT / 2 + CONSTANTS.BALL_DIAMETER / 2);
        }
      }
    });

    ball.position.copyFrom(nextPos);

    // Scoring
    if (ball.position.x > CONSTANTS.SCORE_BOUNDARY_X) {
      leftScore++;
      updateScoreTexture(`${leftScore} : ${rightScore}`);
      if (leftScore >= 3 && leftScore - rightScore >= 2) {
        showWinPopup("Left");
      }
      reset(-1);
    } else if (ball.position.x < -CONSTANTS.SCORE_BOUNDARY_X) {
      rightScore++;
      updateScoreTexture(`${leftScore} : ${rightScore}`);
      if (rightScore >= 3 && rightScore - leftScore >= 2) {
        showWinPopup("Right");
      }
      reset(1);
    }

  });

  return scene;
}
