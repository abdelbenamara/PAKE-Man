/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ball.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/16 17:18:00 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 13:30:30 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Arena } from "#pong";
import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

class Ball {
  public vx: number;
  public vz: number;

  public readonly mesh: Mesh;

  public static readonly RADIUS: number = 0.7;
  public static readonly Y: number = 1.3;
  public static readonly BOUNCE_ANGLE_MAX: number = Math.PI / 3;
  public static readonly SPEED_UP_FACTOR: number = 1.09;
  public static readonly SPEED_MAX: number = 60;

  constructor(scene: Scene) {
    const mat = new StandardMaterial("ball-mat", scene);
    mat.diffuseColor = new Color3(1.0, 0.92, 0.8);
    mat.emissiveColor = new Color3(0.9, 0.75, 0.9);
    mat.disableLighting = true;
    this.mesh = MeshBuilder.CreateSphere(
      "ball",
      {
        diameter: Ball.RADIUS * 2,
        segments: 18,
      },
      scene,
    );
    this.mesh.material = mat;

    this.mesh.position.set(0, Ball.Y, 0);

    this.vx = 0;
    this.vz = 0;
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

  public reset(): void {
    this.mesh.position.set(
      0,
      Ball.Y,
      Math.random() * (Arena.BOUNDS.back - Arena.BOUNDS.front) +
        Arena.BOUNDS.front,
    );
    this.vx = 0;
    this.vz = 0;
  }

  public serve(dirX: number): void {
    const angle = (Math.random() - 0.5) * Ball.BOUNCE_ANGLE_MAX;
    const speed = 20;
    this.vx = Math.cos(angle) * speed * dirX;
    this.vz = Math.sin(angle) * speed;
  }

  public update(deltaTime: number): void {
    this.mesh.position.x += this.vx * deltaTime;
    this.mesh.position.z += this.vz * deltaTime;
    const back = Arena.BOUNDS.back + Ball.RADIUS;
    const front = Arena.BOUNDS.front - Ball.RADIUS;

    if (this.mesh.position.z < back) {
      this.vz = -this.vz;
      this.mesh.position.z = back;
    } else if (this.mesh.position.z > front) {
      this.vz = -this.vz;
      this.mesh.position.z = front;
    }
  }

  public deflectAndSpeedUp(dirX: number, angle: number): void {
    const speed = Math.min(
      Math.hypot(this.vx, this.vz) * Ball.SPEED_UP_FACTOR,
      Ball.SPEED_MAX,
    );
    this.vx = Math.cos(angle) * speed * dirX;
    this.vz = Math.sin(angle) * speed;
  }
}

export default Ball;
export { Ball };
