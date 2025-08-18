/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/14 15:14:22 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 15:50:53 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Game } from "#pong";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

class App {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private isGamePaused: boolean;
  private isGameOver: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.isGamePaused = true;
    this.isGameOver = true;

    window.addEventListener("keydown", async (ev) => {
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          await this.scene.debugLayer.show({ overlay: true });
        }
      }
    });
  }

  public async run(): Promise<void> {
    await this.goToGame();

    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener("resize", () => this.engine.resize());
  }

  private async initializeGameAsync(scene: Scene): Promise<void> {
    const game = new Game(scene);

    scene.registerBeforeRender(game.loop.bind(game));
  }

  private async goToGame(): Promise<void> {
    this.engine.displayLoadingUI();
    this.scene.detachControl();

    const scene = new Scene(this.engine);

    scene.detachControl();

    await this.initializeGameAsync(scene);
    await scene.whenReadyAsync();

    this.engine.hideLoadingUI();
    this.scene.dispose();

    this.scene = scene;

    this.scene.attachControl();
  }
}

export default App;
export { App };
