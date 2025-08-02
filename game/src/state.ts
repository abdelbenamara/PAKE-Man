import { Theme, blueTheme } from './themes';

export let stateSelectedTheme = blueTheme;

let themeListeners: ((theme: Theme) => void)[] = [];

export function setTheme(theme: Theme) {
  stateSelectedTheme = theme;
  themeListeners.forEach(cb => cb(theme));
}

export function onThemeChange(cb: (theme: Theme) => void) {
  themeListeners.push(cb);
}
