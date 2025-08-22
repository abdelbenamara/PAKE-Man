/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/17 11:45:31 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 03:45:10 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  Arena,
  Ball,
  circleRectangleIntersect,
  Environment,
  HUD,
  Input,
  Paddle,
} from "#pong";
import {
  ArcRotateCamera,
  DirectionalLight,
  HemisphericLight,
  Scalar,
  Scene,
  Vector3,
} from "@babylonjs/core";

class Game {
  private scene: Scene;
  private ball: Ball;
  private input: Input;
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private hud: HUD;
  private isPaused: boolean;
  private isOver: boolean;

  constructor(scene: Scene) {
    this.scene = scene;
    const _environment = new Environment(scene);
    const _arena = new Arena(scene);
    this.ball = new Ball(scene);
    this.input = new Input(scene);
    this.leftPaddle = new Paddle(
      scene,
      "paddle-left",
      Arena.BOUNDS.left + 2,
      this.input,
    );
    this.rightPaddle = new Paddle(
      scene,
      "paddle-right",
      Arena.BOUNDS.right - 2,
      this.input,
    );
    this.hud = new HUD();
    this.isPaused = true;
    this.isOver = true;

    this.setupLights();
    this.setupCamera();
  }

  public loop(): void {
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

    if (!this.isPaused && !this.isOver) {
      this.ball.update(deltaTime);
      this.handleScoring(this.ball, this.leftPaddle, this.rightPaddle);
      this.leftPaddle.updateFromControls(deltaTime, {
        up: "KeyW",
        down: "KeyS",
      });
      this.rightPaddle.updateFromControls(deltaTime, {
        up: "KeyO",
        down: "KeyL",
      });
      this.handlePaddleCollision(this.ball, this.leftPaddle, this.rightPaddle);
    }

    if (this.input.resetPressed()) {
      this.isPaused = true;
      this.isOver = true;
      this.ball.reset();
      this.ball.z = 0;
      this.input.flush();
      this.leftPaddle.score = 0;
      this.leftPaddle.z = 0;
      this.rightPaddle.score = 0;
      this.rightPaddle.z = 0;
      this.hud.updateScore(0, 0);
      this.hud.updateResult(0, 0);
    }

    if (this.input.pausePressed()) {
      if (this.isPaused && this.isOver) {
        this.ball.serve(Math.random() > 0.5 ? 1 : -1);
        this.isPaused = false;
        this.isOver = false;
      } else if (!this.isOver) {
        this.isPaused = !this.isPaused;
        this.input.flush();
      }
    }
  }

  private setupLights(): void {
    const hemiLight = new HemisphericLight(
      "hemi-light",
      new Vector3(0, 1, 0),
      this.scene,
    );
    hemiLight.intensity = 0.9;
    const dirLight = new DirectionalLight(
      "dir-light",
      new Vector3(-0.4, -1, -0.3),
      this.scene,
    );
    dirLight.intensity = 0.3;
  }

  private setupCamera(): void {
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI * 1.5,
      0.95,
      60,
      new Vector3(0, 0.5, 0),
      this.scene,
    );
    camera.lowerBetaLimit = 0.2;
    camera.upperBetaLimit = Math.PI / 2.05;
    camera.lowerRadiusLimit = 60;
    camera.upperRadiusLimit = 120;
    camera.wheelPrecision = 30;
    camera.panningSensibility = 120;
    camera.panningDistanceLimit = 60;

    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    camera.storeState();
  }

  private handleScoring(ball: Ball, leftPaddle: Paddle, rightPaddle: Paddle) {
    if (ball.mesh.position.x < Arena.BOUNDS.left + Ball.RADIUS) {
      ball.reset();
      ball.serve(-1);
      rightPaddle.score++;
      this.hud.updateScore(leftPaddle.score, rightPaddle.score);
    } else if (ball.mesh.position.x > Arena.BOUNDS.right - Ball.RADIUS) {
      ball.reset();
      ball.serve(1);
      leftPaddle.score++;
      this.hud.updateScore(leftPaddle.score, rightPaddle.score);
    }

    if (
      (leftPaddle.score === 6 && rightPaddle.score === 0) ||
      (leftPaddle.score === 0 && rightPaddle.score === 6) ||
      (leftPaddle.score >= 11 && leftPaddle.score >= rightPaddle.score + 2) ||
      (leftPaddle.score + 2 <= rightPaddle.score && rightPaddle.score >= 11)
    ) {
      this.isOver = true;
      this.hud.updateResult(leftPaddle.score, rightPaddle.score);
    }
  }

  private handlePaddleCollision(
    ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
  ) {
    const halfDepth = Paddle.DEPTH / 2;

    if (
      circleRectangleIntersect(
        { x: ball.x, z: ball.z, radius: Ball.RADIUS },
        {
          x: leftPaddle.x,
          z: leftPaddle.z,
          width: Paddle.WIDTH,
          depth: Paddle.DEPTH,
        },
      )
    ) {
      const angle =
        Scalar.Clamp((ball.z - leftPaddle.z) / halfDepth, -1, 1) *
        Ball.BOUNCE_ANGLE_MAX;
      ball.deflectAndSpeedUp(1, angle);
    } else if (
      circleRectangleIntersect(
        { x: ball.x, z: ball.z, radius: Ball.RADIUS },
        {
          x: rightPaddle.x,
          z: rightPaddle.z,
          width: Paddle.WIDTH,
          depth: Paddle.DEPTH,
        },
      )
    ) {
      const angle =
        Scalar.Clamp((ball.z - rightPaddle.z) / halfDepth, -1, 1) *
        Ball.BOUNCE_ANGLE_MAX;
      ball.deflectAndSpeedUp(-1, angle);
    }
  }
}

export default Game;
export { Game };
