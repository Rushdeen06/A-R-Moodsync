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

## 🔄 Updating the Live GitHub Pages Site

You now have two ways to deploy updates:

### 1. Automatic (Recommended)
Push commits to the `main` branch. A GitHub Action (`.github/workflows/deploy.yml`) will:
1. Install dependencies
2. Build the production bundle (Vite)
3. Copy `index.html` to `404.html` for SPA routing
4. Publish the `build/` folder to GitHub Pages

First time setup:
1. Ensure your repository has a `main` branch (rename if currently `old-version`):
  ```powershell
  git branch -m old-version main
  git push -u origin main
  ```
2. In GitHub: Repo → Settings → Pages → Source: GitHub Actions

### 2. Manual (Fallback)
Run the batch script:
```powershell
./deploy-github.bat
```
Or use the npm script (requires `gh-pages` dev dependency):
```powershell
npm run deploy
```

### Cache & Service Worker Notes
The app uses hashed filenames for JS/CSS assets, so new builds automatically bust browser cache.
If you re-enable the service worker (`public/service-worker.js`), increment `CACHE_NAME` and build again to force clients to update.

### Troubleshooting Updates
| Symptom | Fix |
| ------- | --- |
| Old UI after deploy | Hard refresh (Ctrl+F5) or clear site data; ensure Action succeeded |
| 404 on deep link | Verify `404.html` exists in deployed artifact (workflow creates it) |
| Blank screen | Check console for missing asset paths; confirm Vite `base` matches repo folder `/A-R-Moodsync/` |
| Action failed | Actions tab → deployment workflow → logs; fix build errors locally |

### Verifying Deployment Artifact Locally
```powershell
npm run build
copy build\index.html build\404.html
```
Inspect `build/` folder; hashed chunks should match references in `index.html`.

---
Need help improving deployment (preview environments or SW version automation)? Open an issue or ask.
