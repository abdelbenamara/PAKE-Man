/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   arena.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/16 10:59:22 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/16 23:39:57 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  Color3,
  MeshBuilder,
  Scalar,
  Scene,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";

class Arena {
  public static readonly WIDTH: number = 50;
  public static readonly DEPTH: number = 30;
  public static readonly THICKNESS: number = 0.5;
  public static readonly BOUNDS: {
    left: number;
    right: number;
    back: number;
    front: number;
  } = {
    left: -Arena.WIDTH / 2,
    right: Arena.WIDTH / 2,
    back: -Arena.DEPTH / 2,
    front: Arena.DEPTH / 2,
  };

  constructor(scene: Scene) {
    const lowerMat = new StandardMaterial("lower-mat", scene);
    lowerMat.diffuseColor = new Color3(0.08, 0.17, 0.25);
    lowerMat.specularColor = new Color3(0.02, 0.02, 0.02);
    lowerMat.emissiveColor = new Color3(0.2, 0.6, 0.8);
    const upperMat = new StandardMaterial("upper-mat", scene);
    upperMat.diffuseColor = new Color3(0.9, 0.9, 0.95);
    upperMat.emissiveColor = new Color3(0.6, 0.6, 0.7);
    const ground = MeshBuilder.CreateGround(
      "table",
      {
        width: Arena.WIDTH + 2,
        height: Arena.DEPTH + 2,
        subdivisions: 3,
      },
      scene,
    );
    ground.material = lowerMat.clone("ground-mat");
    ground.material.backFaceCulling = false;
    ground.material.alpha = 0.5;
    ground.material.wireframe = true;
    const table = MeshBuilder.CreateBox(
      "table",
      {
        width: Arena.WIDTH + 2,
        depth: Arena.DEPTH + 2,
        height: Arena.THICKNESS,
      },
      scene,
    );
    table.position.y = Arena.THICKNESS / 2 - 0.05;
    table.receiveShadows = true;
    table.material = lowerMat.clone("table-mat");
    table.material.alpha = 0.2;
    const dashCount = 11;
    const dashLen = Arena.DEPTH / (dashCount * 1.5);
    const centerDashes = new TransformNode("center-dashes", scene);

    for (let i = 0; i < dashCount; i++) {
      const z = Scalar.Lerp(
        Arena.BOUNDS.back + dashLen,
        Arena.BOUNDS.front - dashLen,
        i / (dashCount - 1),
      );
      const dash = MeshBuilder.CreateBox(
        `dash-${i}`,
        { width: 0.3, depth: dashLen, height: 0.1 },
        scene,
      );
      dash.material = upperMat;

      dash.position.set(0, Arena.THICKNESS + 0.01, z);

      dash.parent = centerDashes;
    }

    const wallThickness = Arena.THICKNESS - 0.1;
    const wallLength = Arena.WIDTH;
    const topWall = MeshBuilder.CreateBox(
      "top-wall",
      {
        width: wallLength,
        depth: wallThickness,
        height: 0.6,
      },
      scene,
    );
    topWall.material = upperMat;

    topWall.position.set(
      0,
      Arena.THICKNESS + 0.3,
      Arena.BOUNDS.front + wallThickness / 2,
    );

    const bottomWall = topWall.clone("bottom-wall");

    bottomWall.position.set(
      0,
      Arena.THICKNESS + 0.3,
      Arena.BOUNDS.back - wallThickness / 2,
    );
  }
}

export default Arena;
export { Arena };
