/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/07 20:46:00 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 03:32:10 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { App } from "#pong/app";
import { Arena } from "#pong/arena";
import { Ball } from "#pong/ball";
import { Environment } from "#pong/environment";
import { Game } from "#pong/game";
import { HUD } from "#pong/hud";
import { Input } from "#pong/input";
import { Paddle } from "#pong/paddle";
import { circleRectangleIntersect } from "#pong/utils";

function loadPong() {
  const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const app = new App(canvas);

  app.run();
}

export {
  App,
  Arena,
  Ball,
  circleRectangleIntersect,
  Environment,
  Game,
  HUD,
  Input,
  loadPong,
  Paddle,
};
