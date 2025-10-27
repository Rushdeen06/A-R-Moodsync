// Theme management utility
export const themeKey = 'moodsync_theme';

export const getTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem(themeKey);
  if (saved === 'dark') return 'dark';
  return 'light';
};

export const setTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(themeKey, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const toggleTheme = () => {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
  return current === 'light' ? 'dark' : 'light';
};