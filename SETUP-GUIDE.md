# 🚀 Zeina Real Estate - Complete Setup Guide

## Quick Start Checklist

### ✅ Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Project name: `zeina-real-estate`
4. Database password: Generate strong password (save it!)
5. Region: Europe - West (closest to Lebanon)
6. Click "Create new project"

### ✅ Step 2: Set Up Database
1. In Supabase dashboard → **SQL Editor**
2. Copy and paste the entire content from `supabase-schema.sql`
3. Click "Run" to execute the SQL
4. This creates tables and sample data

### ✅ Step 3: Get Supabase Credentials
1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### ✅ Step 4: Create Environment File
1. Copy `env.example` to `.env.local`
2. Fill in your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
VITE_ADMIN_EMAIL=zeinasleiman@hotmail.com
VITE_PHONE_MOBILE=+961 76 340 101
VITE_PHONE_TELEPHONE=+961 1 340 101
VITE_EMAIL=zeinasleiman@hotmail.com
```

### ✅ Step 5: Create Admin User
1. In Supabase dashboard → **Authentication** → **Users**
2. Click "Add User"
3. Email: `zeinasleiman@hotmail.com`
4. Password: Choose a strong password
5. Click "Create User"

### ✅ Step 6: Install Dependencies
```bash
# If you have Node.js installed:
npm install

# Or if you prefer yarn:
yarn install
```

### ✅ Step 7: Run Development Server
```bash
npm run dev
# or
yarn dev
```

### ✅ Step 8: Test Admin Access
1. Go to `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. Try adding a new property

## 🔧 Troubleshooting

### "npm not found" Error
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal after installation

### Supabase Connection Issues
- Double-check your environment variables
- Ensure your Supabase project is active
- Check that the SQL schema was executed successfully

### Admin Login Issues
- Verify the admin user was created in Supabase
- Check that the email matches exactly
- Try creating a new admin user if needed

## 📱 Mobile Testing

Test the website on mobile:
1. Open browser developer tools (F12)
2. Click the mobile device icon
3. Test different screen sizes
4. Verify all buttons and forms work on touch

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Netlify
1. Run `npm run build`
2. Upload `dist` folder to Netlify
3. Add environment variables
4. Deploy!

## 🔐 Security Checklist

- ✅ Row Level Security enabled
- ✅ Admin authentication required
- ✅ Environment variables protected
- ✅ Input validation on forms
- ✅ Secure API endpoints

## 📞 Support

Need help? Contact:
- **Email**: zeinasleiman@hotmail.com
- **Phone**: +961 76 340 101

---

**Your Lebanese real estate website is ready! 🇱🇧**
