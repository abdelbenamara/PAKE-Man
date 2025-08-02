import * as BABYLON from '@babylonjs/core';
export interface Theme {
  name: string;
  primaryBackground: string;
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  fontFamily: string;

  // Babylon additions
  fogColor?: BABYLON.Color3;
  glowIntensity?: number;
  paddleColor?: BABYLON.Color3;
  ballColor?: BABYLON.Color3;
  trailColor1?: BABYLON.Color4;
  trailColor2?: BABYLON.Color4;
  trailDeadColor?: BABYLON.Color4;
  gridColor?: BABYLON.Color3;
  scoreTextColor?: string;
}

// === Define Themes ===

export const blueTheme: Theme = {
  name: 'Blue',
  primaryBackground: 'rgba(26, 153, 230, 0.3)',
  primaryTextColor: 'white',
  buttonBackground: 'rgba(26, 153, 230, 0.3)',
  buttonTextColor: 'white',
  fontFamily: 'Valorant, sans-serif',

  fogColor: new BABYLON.Color3(0.05, 0.1, 0.15),
  glowIntensity: 0.3,
  paddleColor: new BABYLON.Color3(0.1, 0.6, 0.9),
  ballColor: new BABYLON.Color3(0.2, 0.6, 1.0),
  trailColor1: new BABYLON.Color4(0.2, 0.6, 1.0, 1.0),
  trailColor2: new BABYLON.Color4(0.0, 0.5, 1.0, 1.0),
  trailDeadColor: new BABYLON.Color4(0, 0, 0.2, 0.0),
  gridColor: new BABYLON.Color3(0.2, 0.6, 0.8),
  scoreTextColor: 'white',
};

export const orangeTheme: Theme = {
  name: 'Orange',
  primaryBackground: 'rgba(255, 140, 0, 0.4)',
  primaryTextColor: 'black',
  buttonBackground: 'rgba(255, 165, 0, 0.5)',
  buttonTextColor: 'black',
  fontFamily: 'Valorant, sans-serif',

  fogColor: new BABYLON.Color3(0.2, 0.1, 0),
  glowIntensity: 0.35,
  paddleColor: new BABYLON.Color3(1.0, 0.5, 0.0),
  ballColor: new BABYLON.Color3(1.0, 0.3, 0),
  trailColor1: new BABYLON.Color4(1.0, 0.5, 0.2, 1.0),
  trailColor2: new BABYLON.Color4(1.0, 0.4, 0.1, 1.0),
  trailDeadColor: new BABYLON.Color4(0.2, 0.05, 0, 0.0),
  gridColor: new BABYLON.Color3(1.0, 0.4, 0.2),
  scoreTextColor: 'black',
};

export const blackWhiteTheme: Theme = {
  name: 'Black & White',
  primaryBackground: 'rgba(0, 0, 0, 0.85)', // Dark background
  primaryTextColor: 'white',
  buttonBackground: 'rgba(255, 255, 255, 0.1)', // Transparent white buttons
  buttonTextColor: 'white',
  fontFamily: 'Valorant, sans-serif',

  fogColor: new BABYLON.Color3(0.05, 0.05, 0.05), // Subtle dark fog
  glowIntensity: 0.2,
  paddleColor: new BABYLON.Color3(1.0, 1.0, 1.0), // White paddle
  ballColor: new BABYLON.Color3(1.0, 1.0, 1.0),   // White ball
  trailColor1: new BABYLON.Color4(1.0, 1.0, 1.0, 0.8), // Bright white trail
  trailColor2: new BABYLON.Color4(0.8, 0.8, 0.8, 0.4), // Fading white
  trailDeadColor: new BABYLON.Color4(0.0, 0.0, 0.0, 0.0), // Fully faded
  gridColor: new BABYLON.Color3(0.3, 0.3, 0.3), // Subtle gray grid
  scoreTextColor: 'white',
};


// === Optional: Export all in a list ===
export const availableThemes: Theme[] = [blueTheme, orangeTheme, blackWhiteTheme];
