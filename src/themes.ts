export interface Theme {
  name: string;
  primaryBackground: string;
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  fontFamily: string;
}

// === Define Themes ===

export const blueTheme: Theme = {
  name: 'Blue',
  primaryBackground: 'rgba(26, 153, 230, 0.3)',
  primaryTextColor: 'white',
  buttonBackground: 'rgba(26, 153, 230, 0.3)',
  buttonTextColor: 'white',
  fontFamily: 'Valorant, sans-serif',
};

export const orangeTheme: Theme = {
  name: 'Orange',
  primaryBackground: 'rgba(255, 140, 0, 0.4)',
  primaryTextColor: 'black',
  buttonBackground: 'rgba(255, 165, 0, 0.5)',
  buttonTextColor: 'black',
  fontFamily: 'Valorant, sans-serif',
};

// === Optional: Export all in a list ===
export const availableThemes: Theme[] = [blueTheme, orangeTheme];
