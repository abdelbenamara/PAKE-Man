export const inputMap: { [key: string]: boolean } = {};
import * as BABYLON from '@babylonjs/core';

export function registerInput(scene: BABYLON.Scene) {
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyDownTrigger,
    evt => inputMap[evt.sourceEvent.key] = true
  ));

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyUpTrigger,
    evt => inputMap[evt.sourceEvent.key] = false
  ));
}
