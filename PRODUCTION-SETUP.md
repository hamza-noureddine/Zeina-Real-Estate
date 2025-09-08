# Production Setup Guide

## 🚀 Deploy to Vercel (Recommended)

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically

### 3. Environment Variables
In Vercel dashboard, add these environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_CONTACT_PHONE`: +961 76 340 101
- `VITE_CONTACT_PHONE_2`: +961 1 340 101
- `VITE_CONTACT_EMAIL`: zeinasleiman@hotmail.com

### 4. Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add `zeinaforrealestate.com.lb`
3. Follow DNS instructions

## 🌐 Domain Registration

### Option 1: .com.lb (Lebanese)
- **Provider**: [libanet.com.lb](https://libanet.com.lb)
- **Cost**: $50-100 USD/year
- **Requirements**: Lebanese business registration

### Option 2: .com (International)
- **Provider**: Namecheap, GoDaddy, Google Domains
- **Cost**: $10-15 USD/year
- **No special requirements**

## 📱 Mobile App (Optional)
Consider creating a mobile app using:
- **React Native** (same codebase)
- **PWA** (Progressive Web App)
- **Capacitor** (web to mobile)

## 🔒 Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Supabase RLS policies enabled
- [ ] Regular backups
- [ ] SSL certificate

## 📊 Analytics (Optional)
- Google Analytics
- Facebook Pixel
- Hotjar for user behavior

## 🎯 SEO Optimization
- Meta tags updated
- Sitemap.xml
- robots.txt
- Google Search Console
- Social media previews
