/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/09 14:30:15 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

const canvas = document.getElementById("app");
const engine = new Engine(canvas as HTMLCanvasElement, true);
const scene = new Scene(engine);
const camera = new ArcRotateCamera(
  "Camera",
  Math.PI / 2,
  Math.PI / 2,
  2,
  Vector3.Zero(),
  scene,
);

camera.attachControl(canvas, true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

// hide/show the Inspector
window.addEventListener("keydown", (ev) => {
  if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show();
    }
  }
});

// run the main render loop
engine.runRenderLoop(() => {
  scene.render();
});
