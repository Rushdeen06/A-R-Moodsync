# 🚀 Quick Start - Deploy to GitHub Pages

## 📋 Checklist

- [ ] Install Git from https://git-scm.com/download/win
- [ ] Create GitHub account at https://github.com
- [ ] Update `package.json` with your GitHub username
- [ ] Create GitHub repository
- [ ] Deploy!

---

## 🎯 3-Minute Setup

### 1. Update Your Username (IMPORTANT!)

Open `package.json` and find this line:
```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/mood-sync"
```

Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username.

**Example:**
```json
"homepage": "https://johnsmith.github.io/mood-sync"
```

### 2. Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `mood-sync`
3. Make it **Public**
4. **DO NOT** check any initialization boxes
5. Click **"Create repository"**

### 3. Run the Deployment Script

Double-click: **`deploy-github.bat`**

The script will:
- ✅ Check your setup
- ✅ Build your app
- ✅ Initialize Git (if needed)
- ✅ Guide you through GitHub setup
- ✅ Deploy to GitHub Pages

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select: **`gh-pages`** branch
4. Click **Save**

**Done!** Your app will be live in 2-3 minutes at:
`https://YOUR-USERNAME.github.io/mood-sync`

---

## 🔄 Update Your Live App

After making changes:

1. Double-click: **`deploy-github.bat`**
2. Wait 2-3 minutes
3. Refresh your live site

---

## 📱 Share Your App

After deployment, share this link:
`https://YOUR-USERNAME.github.io/mood-sync`

Users can install it like a native app:
- **iPhone**: Safari > Share > Add to Home Screen
- **Android**: Chrome > Menu > Install App

---

## 🛠️ Troubleshooting

### "Git not found"
- Install Git from: https://git-scm.com/download/win
- Restart PowerShell
- Run `deploy-github.bat` again

### "Remote repository not configured"
After creating your GitHub repo, run these commands in PowerShell:

```powershell
cd 'c:\Users\Rushdeen.White\Downloads\A&R Mood Sync'
git remote add origin https://github.com/YOUR-USERNAME/mood-sync.git
git push -u origin main
```

Then run `deploy-github.bat` again.

### Page shows 404
- Wait 5-10 minutes after first deployment
- Check Settings > Pages is configured correctly
- Make sure repository is **Public**

---

## 📞 Need Help?

1. Run **`check-setup.bat`** to verify your configuration
2. Check `GITHUB_PAGES_DEPLOY.md` for detailed instructions
3. Common issues and fixes are in the troubleshooting guide

---

**Your app is ready to go live! 🎉**

Just update your username and run `deploy-github.bat`!
