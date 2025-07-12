import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { gameStarted, gamePaused, setGameStarted, setGamePaused, setLeftScore, setRightScore, reset, updateScoreTexture, speed, setSpeed, velocity, setVelocity } from "./game";
import * as CONSTANTS from './constants';
import { blueTheme, orangeTheme, availableThemes, Theme } from './themes';

let currentTheme: Theme = blueTheme;

function applyTheme(theme: Theme, ui: {
  settingsPanel: GUI.Rectangle,
  winPopup: GUI.Rectangle,
  themeButtons: GUI.Button[],
  startButton: GUI.Button,
  menuButton: GUI.Button,
  playAgainButton: GUI.Button
}) {
  currentTheme = theme;
  // (Re)apply theme to UI components
  ui.settingsPanel.background = theme.primaryBackground;
  ui.winPopup.background = theme.primaryBackground;

  ui.startButton.background = theme.primaryBackground;
  ui.menuButton.background = theme.primaryBackground;
  ui.playAgainButton.background = theme.primaryBackground;


  // Update theme button colors to match new theme
  ui.themeButtons.forEach(btn => {
    btn.background = theme.primaryBackground;
  });

  console.log("Applied theme:", theme.name);

}

export interface UIElements {
  startButton: GUI.Button;
  winPopup: GUI.Rectangle;
  winText: GUI.TextBlock;
  settingsPanel: GUI.Rectangle;
  playAgainButton: GUI.Button;
}

export function createUI(scene: BABYLON.Scene): UIElements {
  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const startButton = GUI.Button.CreateSimpleButton("startBtn", "Start");
  startButton.width = "200px";
  startButton.height = "60px";
  startButton.color = "white";
  startButton.background = "rgba(26, 153, 230, 0.3)";
  startButton.paddingTop = "10px";
  startButton.fontFamily = "Valorant, sans-serif";
  // Center on screen
  startButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  startButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  gui.addControl(startButton);

  startButton.onPointerUpObservable.add(() => {
    settingsPanel.isVisible = false;
    if (winPopup) winPopup.isVisible = false;
    setGamePaused(false);
    setGameStarted(true);
    startButton.isVisible = false;
  });

  const winPopup = new GUI.Rectangle("winPopup");
  winPopup.width = "400px";
  winPopup.height = "200px";
  winPopup.thickness = 2;
  winPopup.color = "white";
  winPopup.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  winPopup.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  winPopup.background = "rgba(26, 153, 230, 0.3)";
  winPopup.isVisible = false;
  gui.addControl(winPopup);

  const winStack = new GUI.StackPanel();
  winStack.isVertical = true;
  winPopup.addControl(winStack);

  // WINNER TEXT
  const winText = new GUI.TextBlock();
  winText.text = "";       // will set on show
  winText.fontSize = 32;
  winText.height = "60px";
  winText.color = "white";
  winText.fontFamily = "Valorant, sans-serif";
  winStack.addControl(winText);

  // “PLAY AGAIN” BUTTON
  const playAgainButton = GUI.Button.CreateSimpleButton("playAgain", "Play Again");
  playAgainButton.width = "150px";
  playAgainButton.height = "50px";
  playAgainButton.color = "white";
  playAgainButton.background = "rgba(26, 153, 230, 0.3)";
  playAgainButton.paddingTop = "10px";
  playAgainButton.fontFamily = "Valorant, sans-serif";

  playAgainButton.onPointerUpObservable.add(() => {
    settingsPanel.isVisible = false;
    if (winPopup) winPopup.isVisible = false;
    startButton.isVisible = false;
    setGamePaused(false);
    setGameStarted(true);
    //winPopup.isVisible = false;
    // reset scores & visuals
    setLeftScore(0);
    setRightScore(0);
    updateScoreTexture("0 : 0");

    reset(1);                // serve to the right by default
    const dir = velocity.clone().normalize();  // keep same direction
    setVelocity(dir.scale(speed));             // scale to current speed
  });
  winStack.addControl(playAgainButton);
  const settingsPanel = new GUI.Rectangle();
  settingsPanel.width = "300px";
  settingsPanel.height = "220px";
  settingsPanel.background = "rgba(26, 153, 230, 0.3)";
  settingsPanel.isVisible = false;
  gui.addControl(settingsPanel);

  return { startButton, winPopup, winText, settingsPanel, playAgainButton };
}

export function setupStartButton(startButton, settingsPanel, winPopup, startBtn, setGameStarted, setGamePaused) {
  startButton.onPointerUpObservable.add(() => {
    settingsPanel.isVisible = false;
    if (winPopup) winPopup.isVisible = false;
    setGameStarted(true);
    setGamePaused(false);
    startBtn.isVisible = false;
  });
}

export function createSettingsMenu(scene, { velocity, winPopup, startButton, setGamePaused, setGameStarted, loadMap, getVelocity, setVelocity, getSpeed, setSpeed, gameStarted, playAgainButton }) {
  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // === Menu Button ===
  const menuButton = GUI.Button.CreateSimpleButton("settingsBtn", "Settings");
  menuButton.width = "200px";
  menuButton.height = "60px";
  menuButton.color = "white";
  menuButton.paddingTop = "10px";
  menuButton.paddingLeft = "10px";
  menuButton.fontFamily = "Valorant, sans-serif";
  menuButton.background = "rgba(26, 153, 230, 0.3)";
  menuButton.top = "10px";
  menuButton.left = "10px";
  menuButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  menuButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  gui.addControl(menuButton);

  // === Settings Panel ===
  const settingsPanel = new GUI.Rectangle("settingsPanel");
  settingsPanel.width = "300px";
  settingsPanel.height = "220px";
  settingsPanel.cornerRadius = 10;
  settingsPanel.color = "white";
  settingsPanel.thickness = 2;
  settingsPanel.background = currentTheme.primaryBackground;
  settingsPanel.alpha = 0.8;
  settingsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  settingsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  settingsPanel.isVisible = false;    // start hidden
  gui.addControl(settingsPanel);

  // StackPanel for layout inside the panel
  const stack = new GUI.StackPanel();
  stack.isVertical = true;
  stack.paddingTop = "10px";
  settingsPanel.addControl(stack);

  // — Map buttons —
  // ["Map 1", "Map 2"].forEach((label, i) => {
  //   const btn = GUI.Button.CreateSimpleButton(`mapBtn${i}`, label);
  //   btn.width = "200px";
  //   btn.height = "40px";
  //   btn.marginTop = "5px";
  //   btn.color = "white";
  //   btn.background = "rgba(26, 153, 230, 0.3)";
  //   btn.onPointerUpObservable.add(() => {
  //     console.log("Loading", label);
  //     loadMap && loadMap(label.toLowerCase().replace(" ", ""));
  //   });
  //   stack.addControl(btn);
  // });
  const themeButtons: GUI.Button[] = [];
  availableThemes.forEach((themeOption) => {
    const themeBtn = GUI.Button.CreateSimpleButton(`themeBtn_${themeOption.name}`, themeOption.name);
    themeBtn.width = "200px";
    themeBtn.height = "40px";
    themeBtn.color = "white";
    themeBtn.background = currentTheme.primaryBackground;
    themeBtn.onPointerUpObservable.add(() => {
      applyTheme(themeOption, {
        settingsPanel,
        winPopup,
        themeButtons,
        startButton,
        menuButton,
        playAgainButton
      });
    });
    //console.log(themeOption);
    console.log("current theme", currentTheme);
    themeButtons.push(themeBtn);
    stack.addControl(themeBtn);
  });

  // — Speed slider & label —
  // let speed = INITIAL_BALL_SPEED;    // your existing var
  const speedLabel = new GUI.TextBlock("speedLabel", `Speed: ${speed.toFixed(2)}`);
  speedLabel.height = "30px";
  speedLabel.color = "white";
  speedLabel.paddingTop = "10px";
  stack.addControl(speedLabel);

  const speedSlider = new GUI.Slider("speed");
  speedSlider.minimum = 0.01;
  speedSlider.maximum = CONSTANTS.INITIAL_BALL_SPEED * 10;
  speedSlider.value = speed;
  speedSlider.height = "20px";
  speedSlider.width = "200px";
  speedSlider.background = "rgba(26, 153, 230, 0.3)";
  speedSlider.onValueChangedObservable.add(v => {
    setSpeed(v);
    speedLabel.text = `Speed: ${v.toFixed(2)}`;
    // *** key part: rescale your in-flight velocity ***
    const dir = velocity.clone().normalize();
    setVelocity(dir.scale(v));
  });
  stack.addControl(speedSlider);

  // === Wire up the menuButton to toggle the panel ===
  let wasWinPopupVisible = false;

  menuButton.onPointerUpObservable.add(() => {
    const openingSettings = !settingsPanel.isVisible;

    settingsPanel.isVisible = openingSettings;
    setGamePaused(openingSettings);

    if (openingSettings) {
      // Settings just opened
      wasWinPopupVisible = winPopup.isVisible;
      winPopup.isVisible = false;

      // Hide start button when settings open
      startButton.isVisible = false;

    } else {
      // Settings just closed
      winPopup.isVisible = wasWinPopupVisible;
      wasWinPopupVisible = false;
    }
  });


  // === Save settings on close ===
  settingsPanel.onDisposeObservable.add(() => {
    // Restore win popup only if it was visible before
    winPopup.isVisible = wasWinPopupVisible;
    wasWinPopupVisible = false;

    // Only show start button if game hasn't started and winPopup isn't visible
    startButton.isVisible = !gameStarted && !winPopup.isVisible;
  });

  return {
    menuButton,
    settingsPanel,
    speedSlider,
  };
}
