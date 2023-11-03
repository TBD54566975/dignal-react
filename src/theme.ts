const enum ThemeOptions {
  DARK = 'dark',
  LIGHT = 'light',
}

export function setInitialTheme() {
  const currentTheme =
    'light' ??
    localStorage.getItem('themePreference') ??
    (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeOptions.DARK
      : ThemeOptions.LIGHT);
  document.body.classList.add(currentTheme ?? '');
  const altTheme =
    currentTheme === ThemeOptions.LIGHT
      ? ThemeOptions.DARK
      : ThemeOptions.LIGHT;
  return { currentTheme, altTheme };
}

export function updateLocalTheme() {
  const isDark = document.body.classList.toggle(ThemeOptions.DARK);
  const currentTheme = isDark ? ThemeOptions.DARK : ThemeOptions.LIGHT;
  const altTheme = isDark ? ThemeOptions.LIGHT : ThemeOptions.DARK;
  localStorage.setItem('themePreference', currentTheme);
  return { currentTheme, altTheme };
}

export function getLocalTheme() {
  const isDark = document.body.classList.contains(ThemeOptions.DARK);
  const currentTheme = isDark ? ThemeOptions.DARK : ThemeOptions.LIGHT;
  const altTheme = isDark ? ThemeOptions.LIGHT : ThemeOptions.DARK;
  return { currentTheme, altTheme };
}
