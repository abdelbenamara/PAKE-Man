/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/19 11:50:24 by abenamar         ###   ########.fr       */
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
import "./style.css";

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
camera.attachControl(canvas, true);
// run the main render loop
engine.runRenderLoop(() => {
  scene.render();
});
