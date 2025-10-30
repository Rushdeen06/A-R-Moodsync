# 🚀 Custom Domain Quick Setup - A&R MoodSync

## ✅ What's Already Done

1. **CNAME File**: Created and deployed ✅
2. **Vite Config**: Updated for custom domain ✅
3. **Base URL**: Changed from `/A-R-Moodsync/` to `/` ✅
4. **Deployed**: Pushed to GitHub Pages ✅

---

## 🎯 What You Need To Do

### Step 1: Purchase a Domain (Choose one)
- **armoodsync.com** (Recommended)
- **moodsyncapp.com**
- **armoodtrack.com**
- **moodsync.app**

**Where to buy**: Namecheap, Google Domains, GoDaddy (~$10-15/year)

---

### Step 2: Configure DNS Records

**Go to your domain registrar's DNS settings and add these records:**

#### A Records (for apex domain)
```
Type    Name    Value               TTL
----    ----    -----               ---
A       @       185.199.108.153     300
A       @       185.199.109.153     300
A       @       185.199.110.153     300
A       @       185.199.111.153     300
```

#### CNAME Record (for www subdomain)
```
Type     Name    Value                      TTL
----     ----    -----                      ---
CNAME    www     rushdeen06.github.io       300
```

---

### Step 3: Configure GitHub Pages

1. Go to: https://github.com/Rushdeen06/A-R-Moodsync/settings/pages

2. Under **"Custom domain"**:
   - Enter your domain: `armoodsync.com`
   - Click **Save**

3. Wait 5-10 minutes, then:
   - ✅ Check **"Enforce HTTPS"**

---

### Step 4: Wait for DNS Propagation

⏱️ **Time**: 15 minutes to 2 hours (usually 30 minutes)

**Check status**: https://dnschecker.org/?domain=armoodsync.com

---

## 🔗 Your New URLs

After DNS propagation:
- **Main URL**: https://armoodsync.com
- **WWW URL**: https://www.armoodsync.com
- **Old URL**: https://rushdeen06.github.io/A-R-Moodsync/ (will still work)

---

## ✅ Verification (After 30 minutes)

Test these:
```
✓ https://armoodsync.com → Should load your app with green padlock 🔒
✓ http://armoodsync.com → Should redirect to HTTPS
✓ https://www.armoodsync.com → Should load your app
✓ SSL Certificate → Should be valid (Let's Encrypt)
```

---

## 🐛 Troubleshooting

**Page not loading?**
- Wait longer (DNS can take up to 48 hours)
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito mode

**Not secure / Certificate error?**
- Make sure "Enforce HTTPS" is checked on GitHub
- Wait 10-15 minutes for SSL certificate
- Clear cache and reload

**404 Error?**
- Verify CNAME file exists in repository
- Check GitHub Pages settings
- Try redeploying: `git subtree push --prefix build origin gh-pages`

---

## 📞 Support Links

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Your Repo Settings**: https://github.com/Rushdeen06/A-R-Moodsync/settings/pages

---

## 🎉 Current Status

```
✅ CNAME file: Created (armoodsync.com)
✅ Vite config: Updated (base: '/')
✅ Code deployed: Yes (GitHub Pages)
⏳ Waiting for: You to purchase domain & configure DNS
⏳ Then: Configure GitHub Pages settings
⏳ Finally: Enable HTTPS (automatic)
```

---

**Estimated Total Time**: 
- Buy domain: 5 minutes
- Configure DNS: 10 minutes
- DNS propagation: 30 minutes - 2 hours
- HTTPS setup: Automatic (10 minutes after DNS)

**Total Cost**: $10-15/year for domain (GitHub Pages is free!)

---

**Need Help?** See the complete guide: `DNS_SETUP_GUIDE.md`
