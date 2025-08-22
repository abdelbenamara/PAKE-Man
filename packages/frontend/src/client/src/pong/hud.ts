/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hud.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/17 03:37:09 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 16:04:13 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";

class HUD {
  private scoreText: TextBlock;
  private leftResultText: TextBlock;
  private rightResultText: TextBlock;

  constructor() {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    ui.idealWidth = 720;
    this.scoreText = new TextBlock("score");
    this.scoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.scoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.scoreText.height = "20%";
    this.scoreText.color = "white";
    this.scoreText.fontSize = 32;
    this.scoreText.fontFamily = "Valorant, sans-serif";

    this.updateScore(0, 0);
    ui.addControl(this.scoreText);

    this.leftResultText = new TextBlock("left-result");
    this.leftResultText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftResultText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.leftResultText.top = 32;
    this.leftResultText.height = "20%";
    this.leftResultText.width = "50%";
    this.leftResultText.color = "white";
    this.leftResultText.fontSize = 32;
    this.leftResultText.fontFamily = "Valorant, sans-serif";

    ui.addControl(this.leftResultText);

    this.rightResultText = new TextBlock("right-result");
    this.rightResultText.horizontalAlignment =
      Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.rightResultText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.rightResultText.top = 32;
    this.rightResultText.height = "20%";
    this.rightResultText.width = "50%";
    this.rightResultText.color = "white";
    this.rightResultText.fontSize = 32;
    this.rightResultText.fontFamily = "Valorant, sans-serif";

    this.updateResult(0, 0);
    ui.addControl(this.rightResultText);
  }

  public updateScore(leftScore: number, rightScore: number) {
    this.scoreText.text = `${leftScore}   |   ${rightScore}`;
  }

  public updateResult(leftScore: number, rightScore: number) {
    if (leftScore > rightScore) {
      this.leftResultText.text = "Winner";
      this.rightResultText.text = "Loser";
    } else if (rightScore > leftScore) {
      this.leftResultText.text = "Loser";
      this.rightResultText.text = "Winner";
    } else {
      this.leftResultText.text = "";
      this.rightResultText.text = "";
    }
  }
}

export default HUD;
export { HUD };
