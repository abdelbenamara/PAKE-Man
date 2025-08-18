/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/17 01:36:39 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 03:32:04 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Scalar } from "@babylonjs/core";

function circleRectangleIntersect(
  circle: { x: number; z: number; radius: number },
  rect: { x: number; z: number; width: number; depth: number },
): boolean {
  const halfWidth = rect.width / 2;
  const halfDepth = rect.depth / 2;
  const closestX = Scalar.Clamp(
    circle.x,
    rect.x - halfWidth,
    rect.x + halfWidth,
  );
  const closestZ = Scalar.Clamp(
    circle.z,
    rect.z - halfDepth,
    rect.z + halfDepth,
  );
  const distanceX = circle.x - closestX;
  const distanceZ = circle.z - closestZ;

  return (
    distanceX * distanceX + distanceZ * distanceZ <
    circle.radius * circle.radius
  );
}

export { circleRectangleIntersect };
