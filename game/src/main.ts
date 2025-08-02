import * as BABYLON from '@babylonjs/core';
import { createGameScene } from './game';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas with id "renderCanvas" not found');
    return;
  }

  const engine = new BABYLON.Engine(canvas, true);

  const scene = createGameScene(engine, canvas);

  var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    });
  };

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});
