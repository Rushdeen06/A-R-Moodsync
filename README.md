# A&R Mood Sync

Simplified high-focus mood tracking app: fast logging + concise personal stats. The app now centers on two screens only:

1. Dashboard (Unified)
   - Mood logger (single tap mood + optional note)
   - Key stats: Total Logs, Streak, Average Mood
   - Recent mood entries (last 5)
   - Weekly mini heatmap preview
2. Profile
   - User info & achievement badge
   - Basic stats cards
   - Dark mode toggle
   - Data export (mood entries JSON)
   - Logout

Removed experimental screens: calendar history, social board, AI suggestions, break buddy, breathing exercises, separate mood check-in. This keeps UX lean and closer to a daily reflection flow.

## Features

- One-tap mood logging (Great → Very Low) with optional short note
- Streak tracking & average mood
- Dark mode (persisted in localStorage)
- Export your data (entries + minimal metadata) as JSON
- Privacy-first: data stored locally unless backend sync is enabled

## Tech Stack

- React 18 + TypeScript
- Vite bundler (scripts invoke vite via node path for Windows folders with spaces)
- Motion for animation
- Lucide icons
- Tailwind utility classes (palette applied inline)

## Development

```powershell
npm install
npm run dev
```

## Production Build

```powershell
npm run build
```

Output in `build/` ready for GitHub Pages deploy.

## Data Export

JSON schema from Profile > Export Data:

```json
{
  "userInfo": { "name": "String", "email": "String" },
  "stats": { "totalEntries": Number, "currentStreak": Number },
  "entries": [
    { "mood": "great|good|okay|low|very-low", "note": "String", "timestamp": "ISO", "intensity": Number }
  ],
  "exportDate": "ISO"
}
```

## Dark Mode Palette

- Background: `#1a1a1a`
- Card: `#2d2d2d`
- Accent Teal: `#4FB3C5`
- Accent Gold: `#FFB84D`
- Accent Red: `#FF6B6B`

## Roadmap

- Optional insights panel (focus time, breaks) once capture added
- Teams integration manifest scaffold
- Expand heatmap beyond week preview

## Reference

Original design concept: https://www.figma.com/design/bsZS3oliXe8YSP5iLIkcmS/A-R-Mood-Sync

## License

Internal prototype – licensing TBD.
