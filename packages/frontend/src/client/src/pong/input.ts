/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   input.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/16 18:11:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 21:08:12 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  ActionManager,
  ExecuteCodeAction,
  Scalar,
  Scene,
} from "@babylonjs/core";

class Input {
  public vertical: {
    [key: string]: number;
  };
  public reset: boolean;
  public paused: boolean;

  constructor(scene: Scene) {
    this.vertical = {
      KeyO: 0,
      KeyL: 0,
      KeyW: 0,
      KeyS: 0,
    };
    this.reset = false;
    this.paused = false;
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        this.onKeyDown(evt.sourceEvent);
      }),
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        this.onKeyUp(evt.sourceEvent);
      }),
    );
  }

  public resetPressed(): boolean {
    const pressed = this.reset;
    this.reset = false;

    return pressed;
  }

  public pausePressed(): boolean {
    const pressed = this.paused;
    this.paused = false;

    return pressed;
  }

  public flush(): void {
    this.vertical = {
      KeyO: 0,
      KeyL: 0,
      KeyW: 0,
      KeyS: 0,
    };
    this.reset = false;
    this.paused = false;
  }

  private onKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case "KeyO":
      case "KeyW":
        this.vertical[e.code] = Scalar.Lerp(this.vertical[e.code], 1, 0.8);
        break;
      case "KeyL":
      case "KeyS":
        this.vertical[e.code] = Scalar.Lerp(this.vertical[e.code], -1, 0.8);
        break;
      case "KeyR":
        this.reset = true;
        break;
      case "KeyG":
        this.paused = true;
        break;
      default:
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case "KeyO":
      case "KeyW":
      case "KeyL":
      case "KeyS":
        this.vertical[e.code] = 0;
        break;
      default:
        break;
    }
  }
}

export default Input;
export { Input };
