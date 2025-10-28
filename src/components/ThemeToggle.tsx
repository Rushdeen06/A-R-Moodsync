import { Switch } from './ui/switch';
import { useTheme } from '../utils/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Switch
      checked={isDark}
      onCheckedChange={toggleTheme}
      aria-label="Toggle dark mode"
    />
  );
}