# HUMSJ Website Setup Guide

## Firebase & Cloudinary Integration

Your website is now connected to Firebase and Cloudinary for database and photo storage.

### ✅ What's Already Configured

1. **Firebase** - Database & Authentication
   - Firestore Database for storing form submissions
   - Firebase Authentication for admin login
   - Firebase Analytics for tracking

2. **Cloudinary** - Photo Storage
   - Image uploads for help registration documents
   - Optimized image delivery

---

## 🔧 Setup Steps

### 1. Cloudinary Setup (IMPORTANT)

You need to create an **Upload Preset** in your Cloudinary dashboard:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Login with your account (dzmjhapvj)
3. Navigate to **Settings** → **Upload**
4. Scroll to **Upload presets**
5. Click **Add upload preset**
6. Set the following:
   - **Preset name**: `humsj_uploads`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `humsj` (optional, for organization)
7. Click **Save**

### 2. Firebase Setup

#### Create Admin User:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `humsj-ea-pr`
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter email and password for admin
6. Copy the **User UID**

#### Set Admin Role:
1. Go to **Firestore Database**
2. Create a new collection called `admins`
3. Add a document with:
   - **Document ID**: [paste the User UID from above]
   - **Field**: `isAdmin` (boolean) = `true`
   - **Field**: `email` (string) = [admin email]
   - **Field**: `name` (string) = [admin name]

### 3. Environment Variables

The `.env` file is already created with your credentials. Make sure it's not committed to git (it's in .gitignore).

---

## 📁 Project Structure

```
husmj-48-main/
├── src/
│   ├── lib/
│   │   ├── firebase.ts       # Firebase configuration
│   │   └── cloudinary.ts     # Cloudinary upload functions
│   ├── pages/
│   │   ├── AdminLogin.tsx    # Admin login page
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   ├── HelpRegistration.tsx # Help form with file upload
│   │   └── AssistanceRequest.tsx # Assistance form
├── .env                       # Environment variables (not in git)
└── .env.example              # Example env file
```

---

## 🚀 How It Works

### Form Submissions:
1. User fills out form (Help Registration or Assistance Request)
2. If file is attached, it uploads to Cloudinary
3. Form data + file URL saved to Firebase Firestore
4. Admin can view all submissions in dashboard

### Admin Dashboard:
1. Admin logs in at `/admin/login`
2. System checks if user has admin role in Firestore
3. Dashboard shows all submissions with:
   - View details
   - Delete submissions
   - Filter by type

---

## 🔐 Security Notes

- Never commit `.env` file to git
- API keys are already in `.env` and `.gitignore`
- Cloudinary uploads are unsigned (safe for client-side)
- Firebase security rules should be configured in Firebase Console

---

## 📞 Contact Information

- Phone: +251 985 736 451
- M-Pesa: 0799129735
- Bank: CBE Account 1000614307599
- Telegram: https://t.me/humsjofficialchannel

---

## 🎯 Next Steps

1. ✅ Create Cloudinary upload preset (see step 1 above)
2. ✅ Create admin user in Firebase (see step 2 above)
3. Test form submissions
4. Test admin login and dashboard
5. Configure Firebase security rules (optional but recommended)

---

## 🐛 Troubleshooting

**File upload fails:**
- Check if Cloudinary upload preset `humsj_uploads` exists
- Verify it's set to "Unsigned" mode

**Admin login fails:**
- Verify user exists in Firebase Authentication
- Check if admin document exists in `admins` collection
- Ensure `isAdmin` field is set to `true`

**Forms not saving:**
- Check Firebase Firestore rules
- Verify internet connection
- Check browser console for errors
