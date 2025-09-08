# Zeina Real Estate - Lebanese Property Listings Platform

A modern, secure, and mobile-friendly real estate website for Lebanon with an easy-to-use admin dashboard.

## 🚀 Features

- **Modern Design**: Clean, responsive design with Lebanese-inspired colors
- **Mobile-Friendly**: Fully responsive design that works on all devices
- **Admin Dashboard**: Simple interface for posting property ads without technical knowledge
- **Secure Authentication**: Supabase-powered authentication and database
- **Property Management**: Full CRUD operations for property listings
- **Contact Integration**: Direct contact information display
- **Smooth Animations**: Beautiful transitions and animations throughout

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Supabase account** (free tier available)
4. **Git** for version control

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd zeina-real-estate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Name your project: `zeina-real-estate`
3. Choose a region closest to Lebanon
4. Set a strong database password
5. Wait for the project to be created

### 4. Configure Database

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and run it
3. This will create the necessary tables and sample data

### 5. Set Up Environment Variables

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=zeinasleiman@hotmail.com
VITE_PHONE_MOBILE=+961 76 340 101
VITE_PHONE_TELEPHONE=+961 1 340 101
VITE_EMAIL=zeinasleiman@hotmail.com
```

### 6. Set Up Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add User** and create an admin account with:
   - Email: `zeinasleiman@hotmail.com`
   - Password: (choose a strong password)
3. The user will be automatically added to the admin_users table

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The website will be available at `http://localhost:5173`

## 🔐 Admin Access

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin`
- **Default Admin Email**: `zeinasleiman@hotmail.com`

## 📱 Mobile Optimization

The website is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized images and loading
- Mobile-first design approach
- Fast loading times

## 🎨 Customization

### Colors
The website uses a modern color palette inspired by Lebanese aesthetics:
- Primary: Deep modern blue
- Accent: Emerald green
- Additional Lebanese flag colors available

### Contact Information
Update contact details in:
- `src/pages/Contact.tsx`
- Environment variables
- Navigation component

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication required** for admin operations
- **Input validation** on all forms
- **Secure API endpoints** through Supabase
- **Environment variable protection**

## 📊 Database Schema

### Properties Table
- `id`: Unique identifier
- `title`: Property title
- `description`: Detailed description
- `price`: Property price
- `currency`: USD or LBP
- `location`: Property location
- `area`: Area in square meters
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `property_type`: apartment, house, villa, commercial, land
- `status`: for_sale, for_rent, sold, rented
- `images`: Array of image URLs
- `features`: Array of property features
- `contact_phone`: Contact phone number
- `contact_email`: Contact email
- `is_featured`: Featured property flag
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Admin Users Table
- `id`: Unique identifier
- `email`: Admin email
- `name`: Admin name
- `created_at`: Creation timestamp

## 🎯 Usage

### For Property Owners
1. Contact Zeina Real Estate to get admin access
2. Log in to the admin dashboard
3. Add new properties with photos and details
4. Manage existing listings
5. Update property status (sale/rent/sold)

### For Property Seekers
1. Browse properties on the main website
2. Use filters to find specific properties
3. View detailed property information
4. Contact directly via phone or email

## 📞 Support

For technical support or questions:
- **Email**: zeinasleiman@hotmail.com
- **Phone**: +961 76 340 101
- **Telephone**: +961 1 340 101

## 📄 License

This project is proprietary software for Zeina Real Estate.

---

**Built with ❤️ for the Lebanese real estate market**