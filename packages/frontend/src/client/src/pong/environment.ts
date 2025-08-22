/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   environment.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/16 15:31:58 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 03:45:58 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import nightSkyImage from "#assets/images/skybox.jpg";
import {
  Color3,
  GlowLayer,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

class Environment {
  constructor(scene: Scene) {
    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogDensity = 0.005;
    scene.fogColor = new Color3(0.05, 0.1, 0.15);
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 360.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new Texture(nightSkyImage, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode =
      Texture.FIXED_EQUIRECTANGULAR_MODE;
    skybox.material = skyboxMaterial;
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.8;
  }
}

export default Environment;
export { Environment };
