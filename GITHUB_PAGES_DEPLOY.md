# 🚀 GitHub Pages Deployment Guide

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Run installer with default settings
   - Restart PowerShell after installation

2. **Create GitHub Account**:
   - Go to: https://github.com
   - Sign up for free

## Step-by-Step Deployment

### Step 1: Update Configuration

1. Open `package.json`
2. Find the line: `"homepage": "https://YOUR-GITHUB-USERNAME.github.io/mood-sync"`
3. Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username
   - Example: `"homepage": "https://johnsmith.github.io/mood-sync"`

### Step 2: Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
cd 'c:\Users\Rushdeen.White\Downloads\A&R Mood Sync'
git init
git add .
git commit -m "Initial commit - MoodSync PWA"
```

### Step 3: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `mood-sync`
3. Description: "A&R Mood Sync - Mood Tracking PWA"
4. Keep it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 4: Link and Push to GitHub

After creating the repo, GitHub will show you commands. Run:

```powershell
cd 'c:\Users\Rushdeen.White\Downloads\A&R Mood Sync'
git remote add origin https://github.com/YOUR-USERNAME/mood-sync.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 5: Deploy to GitHub Pages

```powershell
cd 'c:\Users\Rushdeen.White\Downloads\A&R Mood Sync'
npm run deploy
```

This will:
- Build your app
- Create a `gh-pages` branch
- Deploy to GitHub Pages
- Give you a URL

### Step 6: Enable GitHub Pages (First Time Only)

1. Go to your repo: `https://github.com/YOUR-USERNAME/mood-sync`
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select branch: `gh-pages`
5. Click **Save**

**Your app will be live at:**
`https://YOUR-USERNAME.github.io/mood-sync`

---

## 🔄 Updating Your Live App

After making changes:

```powershell
cd 'c:\Users\Rushdeen.White\Downloads\A&R Mood Sync'
git add .
git commit -m "Description of your changes"
git push
npm run deploy
```

Wait 2-3 minutes for changes to appear live.

---

## ⚠️ Important Notes

### Backend API
GitHub Pages only hosts static files (frontend). For full functionality:

**Option 1: Use Backend Hosting**
- Deploy backend separately (Render, Railway, Heroku)
- Update `src/utils/api.tsx`:
  ```typescript
  const API_BASE = 'https://your-backend-url.com/api';
  ```

**Option 2: Serverless Functions**
- Use Vercel, Netlify, or Cloudflare Workers
- Move backend logic to serverless functions

**Option 3: Mock Data (Testing)**
- App will work with local storage only
- No backend needed for basic functionality

### Custom Domain (Optional)
1. Buy a domain (Namecheap, Google Domains)
2. In repo Settings > Pages, add custom domain
3. Update DNS records as shown

---

## 📱 Progressive Web App Features

After deployment, users can:
- **iPhone**: Safari > Share > Add to Home Screen
- **Android**: Chrome > Menu > Install App
- **Desktop**: Install button in address bar

---

## 🛠️ Troubleshooting

### Page Not Found (404)
- Wait 5-10 minutes after first deployment
- Check Settings > Pages shows `gh-pages` branch
- Verify homepage URL in `package.json` matches your GitHub username

### Blank Page
- Check browser console for errors
- Verify `base: '/mood-sync/'` in `vite.config.ts`
- Ensure build folder was created successfully

### Images Not Loading
- Make sure images are in `public` folder
- Use relative paths: `/icon-192.png` not `./icon-192.png`

### Can't Push to GitHub
- Check if you're logged into Git:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your@email.com"
  ```

---

## 🎯 Quick Commands Reference

```powershell
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/mood-sync.git
git push -u origin main
npm run deploy

# Every update after
git add .
git commit -m "Update description"
git push
npm run deploy

# Check deployment status
npm run build  # Test build locally
```

---

## 🌟 Example Workflow

1. Make changes to your code
2. Test locally:
   ```powershell
   npm run build
   cd server
   node index.js
   ```
3. Deploy to GitHub Pages:
   ```powershell
   git add .
   git commit -m "Added new feature"
   git push
   npm run deploy
   ```
4. Wait 2-3 minutes
5. Visit: `https://YOUR-USERNAME.github.io/mood-sync`

---

## 📧 Support

If you encounter issues:
1. Check GitHub Pages status: Settings > Pages
2. View deployment logs in Actions tab
3. Check browser console for JavaScript errors

Your app is ready to share with the world! 🎉
