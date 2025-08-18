/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   paddle.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/16 17:57:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 12:38:33 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Arena, Ball, Input } from "#pong";
import {
  Color3,
  Mesh,
  MeshBuilder,
  Scalar,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

class Paddle {
  public score: number;

  public readonly mesh: Mesh;

  public static readonly WIDTH: number = 1.2;
  public static readonly HEIGHT: number = 1.4;
  public static readonly DEPTH: number = 8;
  public static readonly SPEED: number = 30;

  private scene: Scene;
  private input: Input;

  constructor(scene: Scene, name: string, x: number, input: Input) {
    this.score = 0;
    const mat = new StandardMaterial(`${name}-mat`, scene);
    mat.diffuseColor = new Color3(1.0, 0.92, 0.8);
    mat.emissiveColor = new Color3(0.6, 0.5, 0.6);
    mat.disableLighting = true;
    this.mesh = MeshBuilder.CreateBox(
      name,
      {
        width: Paddle.WIDTH,
        height: Paddle.HEIGHT,
        depth: Paddle.DEPTH,
      },
      scene,
    );
    this.mesh.material = mat;

    this.mesh.position.set(x, Ball.Y, 0);

    this.scene = scene;
    this.input = input;
  }

  get x(): number {
    return this.mesh.position.x;
  }

  get z(): number {
    return this.mesh.position.z;
  }

  set x(value: number) {
    this.mesh.position.x = value;
  }

  set z(value: number) {
    this.mesh.position.z = value;
  }

  public updateFromControls(
    deltaTime: number,
    { up, down }: { up: string; down: string },
  ): void {
    const direction = this.input.vertical[up] + this.input.vertical[down];
    this.mesh.position.z += direction * Paddle.SPEED * deltaTime;
    const half = Paddle.DEPTH / 2;
    this.mesh.position.z = Scalar.Clamp(
      this.mesh.position.z,
      Arena.BOUNDS.back + half,
      Arena.BOUNDS.front - half,
    );
  }
}

export default Paddle;
export { Paddle };
