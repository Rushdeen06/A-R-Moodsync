# DNS Configuration & HTTPS Setup Guide

## 🌐 Custom Domain Setup for GitHub Pages

This guide will help you configure your custom domain with automatic HTTPS.

---

## 📋 Prerequisites

1. **Purchase a Domain** (if you don't have one):
   - Recommended registrars: Namecheap, Google Domains, GoDaddy, Cloudflare
   - Cost: ~$10-15/year
   - Suggested domains: `armoodsync.com`, `moodsync.app`, `armoodtrack.com`

2. **GitHub Repository**: ✅ Already set up (A-R-Moodsync)

---

## 🚀 Step 1: Configure CNAME File

✅ **Already completed!** The CNAME file has been created at `public/CNAME`

Current configuration:
```
armoodsync.com
```

**To use a different domain**, edit the CNAME file with your purchased domain.

---

## 🔧 Step 2: DNS Configuration

### For Apex Domain (armoodsync.com)

Add these **A Records** in your domain registrar's DNS settings:

```
Type    Name    Value
----    ----    -----
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

### Optional IPv6 Support (AAAA Records)

If your registrar supports IPv6 (recommended for global reach), also add these **AAAA Records**:

```
Type    Name    Value
----    ----    -----
AAAA    @       2606:50c0:8000::153
AAAA    @       2606:50c0:8001::153
AAAA    @       2606:50c0:8002::153
AAAA    @       2606:50c0:8003::153
```

Notes:
- Add all four to ensure GitHub's anycast network can serve your site over IPv6.
- If on Cloudflare, you may leave them out and let Cloudflare proxy IPv6; otherwise add them directly.

### For WWW Subdomain (www.armoodsync.com)

Add this **CNAME Record**:

```
Type     Name    Value
----     ----    -----
CNAME    www     rushdeen06.github.io
```

---

## 📝 Step 3: DNS Configuration by Registrar

### **Namecheap**
1. Log in to Namecheap
2. Go to **Domain List** → Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Add the A Records and CNAME record above
5. Set TTL to **Automatic** or **300 seconds**

### **GoDaddy**
1. Log in to GoDaddy
2. Go to **My Products** → **DNS** next to your domain
3. Click **Add** to add new records
4. Add the A Records and CNAME record above
5. Save changes

### **Google Domains**
1. Log in to Google Domains
2. Click on your domain → **DNS** in the left menu
3. Scroll to **Custom resource records**
4. Add the A Records and CNAME record above
5. Save changes

### **Cloudflare**
1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Add the A Records and CNAME record above
5. **Important**: Set proxy status to "DNS only" (grey cloud) initially
6. Save changes

---

## ⚙️ Step 4: GitHub Pages Configuration

1. Go to your repository: https://github.com/Rushdeen06/A-R-Moodsync

2. Click **Settings** → **Pages** (in left sidebar)

3. Under **Custom domain**:
   - Enter: `armoodsync.com` (or your purchased domain)
   - Click **Save**

4. ✅ **Enforce HTTPS**:
   - Wait 5-10 minutes for DNS to propagate
   - Check the box: **"Enforce HTTPS"**
   - GitHub will automatically provision an SSL certificate

---

## 🔄 Step 5: Build & Deploy

Now rebuild and deploy with the new configuration:

```bash
# Build with new base URL
npm run build

# Commit changes
git add .
git commit -m "feat: Configure custom domain with HTTPS"
git push origin main

# Deploy to GitHub Pages
git subtree push --prefix build origin gh-pages
```

---

## ⏱️ DNS Propagation Time

- **Minimum**: 5-15 minutes
- **Average**: 1-2 hours
- **Maximum**: 48 hours (rare)

**Check DNS propagation**: https://dnschecker.org

---

## 🔒 HTTPS Certificate

GitHub Pages will automatically:
1. Detect your custom domain
2. Request a Let's Encrypt SSL certificate
3. Enable HTTPS redirect
4. Renew certificate automatically (every 90 days)

**Certificate Status**: Check at GitHub Settings → Pages → "HTTPS"

---

## ✅ Verification Checklist

After DNS propagation (wait 15-30 minutes):

- [ ] Visit `http://armoodsync.com` → Should load your app
- [ ] Visit `https://armoodsync.com` → Should have green padlock 🔒
- [ ] Visit `http://www.armoodsync.com` → Should redirect to main domain
- [ ] Check certificate: Click padlock in browser → Certificate should be valid
- [ ] Test on mobile: Should work with HTTPS
- [ ] Check redirect: HTTP should auto-redirect to HTTPS

---

## 🐛 Troubleshooting

### Problem: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution**: DNS not propagated yet. Wait 1-2 hours.

### Problem: "Certificate error" or "Not Secure"
**Solution**: 
1. Make sure "Enforce HTTPS" is checked in GitHub Pages settings
2. Wait 10-15 minutes for certificate provisioning
3. Clear browser cache and reload

### Problem: "404 - Page not found"
**Solution**:
1. Verify CNAME file exists in `build/` folder after build
2. Make sure `base: '/'` in vite.config.ts
3. Redeploy to gh-pages branch

### Problem: CSS/JS not loading
**Solution**:
1. Check browser console for 404 errors
2. Verify all asset paths are relative (not absolute)
3. Clear GitHub Pages cache by making a dummy commit

### Problem: Domain shows old GitHub Pages URL
**Solution**:
1. Wait for DNS propagation (up to 48 hours)
2. Clear browser cache (Ctrl + Shift + Delete)
3. Try incognito/private browsing mode
4. Use `curl -I https://armoodsync.com` to check headers

---

## 📊 Current Configuration Summary

```yaml
Repository: Rushdeen06/A-R-Moodsync
Branch: gh-pages
Custom Domain: armoodsync.com
HTTPS: Automatic (GitHub managed)
Base URL: / (root)
CNAME File: ✅ Created in public/CNAME
```

---

## 🔗 Alternative Domain Examples

If `armoodsync.com` is taken, try:
- `armoodtrack.com`
- `moodsyncapp.com`
- `armoodtracker.com`
- `moodsync.app`
- `armoodsync.io`
- `getmoodsync.com`

---

## 🎯 Quick Reference URLs

- **Repository**: https://github.com/Rushdeen06/A-R-Moodsync
- **Settings**: https://github.com/Rushdeen06/A-R-Moodsync/settings/pages
- **Current GitHub URL**: https://rushdeen06.github.io/A-R-Moodsync/
- **New Custom URL**: https://armoodsync.com (after setup)
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html

---

## 💡 Pro Tips

1. **Use Cloudflare** (Free tier):
   - Faster DNS propagation (2-5 minutes)
   - Free CDN for faster global loading
   - DDoS protection
   - Web analytics

2. **Add www redirect**:
   - Both `armoodsync.com` and `www.armoodsync.com` will work
   - Users can access via either URL

3. **Email setup**:
   - Use your custom domain for branded emails
   - Recommended: Google Workspace, Zoho Mail (free), ProtonMail

4. **SEO Benefits**:
   - Custom domain improves trust and professionalism
   - Better for sharing on social media
   - Easier to remember and brand

---

## 📞 Need Help?

**GitHub Pages Documentation**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

**DNS Providers Support**:
- Namecheap: https://www.namecheap.com/support/
- GoDaddy: https://www.godaddy.com/help
- Google Domains: https://support.google.com/domains/
- Cloudflare: https://support.cloudflare.com/

---

**Last Updated**: October 30, 2025  
**Status**: Ready for deployment after domain purchase
