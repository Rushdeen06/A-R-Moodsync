import { Switch } from './ui/switch';

export function ThemeToggle() {
  // Theme toggle disabled - app uses static light theme
  return (
    <Switch
      checked={false}
      onCheckedChange={() => {}}
      aria-label="Toggle dark mode"
      disabled
    />
  );
}