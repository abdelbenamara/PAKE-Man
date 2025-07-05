/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mount.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 22:15:59 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  ActionManager,
  Color3,
  Engine,
  ExecuteCodeAction,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders";
import htmx from "htmx.org";

function loadPong() {
  // BabylonJS PAKE-Man game setup
  const canvas = document.getElementById("pongCanvas");
  const engine = new Engine(canvas as HTMLCanvasElement, true);
  const createScene = () => {
    const scene = new Scene(engine);
    const camera = new FreeCamera("cam", new Vector3(0, 5, -15), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    // eslint-disable-next-line no-new
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Materials
    const paddleMat = new StandardMaterial("paddleMat", scene);
    paddleMat.diffuseColor = new Color3(0, 0.5, 1);
    const ballMat = new StandardMaterial("ballMat", scene);
    ballMat.diffuseColor = new Color3(1, 0, 0);

    // Paddles
    const leftPaddle = MeshBuilder.CreateBox(
      "leftPaddle",
      { height: 1, width: 0.5, depth: 3 },
      scene,
    );
    leftPaddle.position = new Vector3(-10, 0, 0);
    leftPaddle.material = paddleMat;
    const rightPaddle = leftPaddle.clone("rightPaddle");
    rightPaddle.position = new Vector3(10, 0, 0);

    // Ball
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
    ball.material = ballMat;
    const ballDir = new Vector3(1, 0.2, 0.8).normalize().scale(0.2);

    // Input handling
    const inputMap = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnKeyDownTrigger,
        (evt) => (inputMap[evt.sourceEvent.key] = true),
      ),
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnKeyUpTrigger,
        (evt) => (inputMap[evt.sourceEvent.key] = false),
      ),
    );

    scene.onBeforeRenderObservable.add(() => {
      // Paddle movement
      if (inputMap["w"]) leftPaddle.position.y += 0.2;
      if (inputMap["s"]) leftPaddle.position.y -= 0.2;
      if (inputMap["ArrowUp"]) rightPaddle.position.y += 0.2;
      if (inputMap["ArrowDown"]) rightPaddle.position.y -= 0.2;

      // Ball movement and collisions
      ball.position.addInPlace(ballDir);
      if (ball.position.y > 5 || ball.position.y < -5) ballDir.y *= -1;
      if (
        ball.intersectsMesh(leftPaddle, false) ||
        ball.intersectsMesh(rightPaddle, false)
      ) {
        ballDir.x *= -1;
      }
      if (ball.position.x > 15 || ball.position.x < -15) {
        ball.position = Vector3.Zero();
      }
    });

    return scene;
  };

  const scene = createScene();

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
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

function loadTournaments() {
  const upcoming = [
    { name: "Summer Showdown", date: "2025-07-15" },
    { name: "July Clash", date: "2025-07-30" },
  ];
  const terminated = [{ name: "Spring Cup", date: "2025-05-20" }];
  const up = document.getElementById("upcomingList")!;

  up.replaceChildren();
  upcoming.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} - ${t.date}`;

    up.appendChild(li);
  });

  const term = document.getElementById("terminatedList")!;

  term.replaceChildren();
  terminated.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} - ${t.date}`;

    term.appendChild(li);
  });
}

function loadProfile() {
  document
    .getElementById("profilePicInput")!
    .addEventListener("change", (e) => {
      const file = (e.target! as any).files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () =>
          ((document.getElementById("displayPic")! as any).src = reader.result);

        reader.readAsDataURL(file);
      }
    });

  document.getElementById("profileForm")!.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("nameInput")! as any).value;
    document.getElementById("displayName")!.textContent = name;
  });

  let twoFAEnabled = false;

  document.getElementById("enable2faBtn")!.addEventListener("click", () => {
    twoFAEnabled = !twoFAEnabled;
    document.getElementById("enable2faBtn")!.textContent = twoFAEnabled
      ? "Disable 2FA"
      : "Enable 2FA";
  });
}

function hydrate() {
  const routes = {
    "/pong": loadPong,
    "/tournaments": loadTournaments,
    "/profile": loadProfile,
  };
  const path = document.location.pathname;

  console.log(path);

  if (routes[path]) {
    routes[path]();
  } else {
    console.warn(`No script found for path: ${path}`);
  }
}

htmx.on("htmx:afterSettle", hydrate);
hydrate();
