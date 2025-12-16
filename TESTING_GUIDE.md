# Testing Guide for News & Events System

## Quick Test Checklist

### 1. Test Post Creation
1. Navigate to `http://localhost:8080/admin/login`
2. Login with admin credentials
3. Click "Create Post" button
4. Fill out the form:
   - **Post Type**: Select "News Article" or "Event"
   - **Title**: Enter a test title
   - **Category**: Select any category
   - **Content**: Enter some test content (minimum 20 characters)
   - **Media**: Upload a test image, video, or audio file (optional)
5. Click "Publish"
6. Should redirect to admin dashboard
7. Check the "Posts" tab to see your new post

### 2. Test Post Display
1. Navigate to `http://localhost:8080/news`
2. Your new post should appear at the top of the news grid
3. Test category filtering by clicking different category buttons
4. Verify media files display correctly (images, videos with controls, audio players)

### 3. Test Admin Dashboard
1. Go to `http://localhost:8080/admin/dashboard`
2. Check the "Posts" counter shows correct number
3. Click on "Posts" tab
4. Verify your posts are listed with thumbnails
5. Click the eye icon to view post details
6. Test delete functionality (optional)

## Debugging Steps

### If Posts Don't Show on News Page
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Navigate to News page
4. Look for these messages:
   - "Firebase posts loaded: X" (where X is number of posts)
   - "Posts data: [array of posts]"
   - If you see "No Firebase posts found", check Firebase connection

### Check Firebase Connection
1. Open Developer Tools → Console
2. Look for any Firebase errors (red text)
3. Common issues:
   - "Permission denied" → Check Firebase rules
   - "Network error" → Check internet connection
   - "Invalid API key" → Check .env file configuration

### Check Cloudinary Upload
1. When uploading media, watch for toast notifications
2. "Uploading image/video/audio..." should appear
3. If upload fails, check:
   - File size limits (Image: 5MB, Video: 50MB, Audio: 20MB)
   - File format compatibility
   - Cloudinary configuration in .env

## Expected Behavior

### Post Creation Flow
1. Form validation prevents submission with invalid data
2. Media files upload to Cloudinary first
3. Post data saves to Firebase Firestore
4. Success toast appears
5. Redirect to admin dashboard
6. Post appears in Posts tab immediately

### News Page Display
1. Posts load from Firebase on page load
2. Firebase posts appear before sample news
3. Category filtering works for all posts
4. Media displays correctly:
   - Images: Show as thumbnails, scale on hover
   - Videos: Show with controls, use image as poster if available
   - Audio: Show as audio player controls

### Admin Dashboard
1. Posts counter updates automatically
2. Posts tab shows all posts with media thumbnails
3. Detail modal shows full post content and media
4. Delete function removes posts from Firebase

## File Locations for Debugging

- **CreatePost Component**: `src/pages/CreatePost.tsx`
- **News Display**: `src/pages/News.tsx`  
- **Admin Dashboard**: `src/pages/AdminDashboard.tsx`
- **Firebase Config**: `src/lib/firebase.ts`
- **Cloudinary Config**: `src/lib/cloudinary.ts`
- **Environment Variables**: `.env`

## Common Issues & Solutions

### Issue: "Posts not showing on news page"
**Solution**: 
1. Check browser console for Firebase errors
2. Verify posts exist in Admin Dashboard → Posts tab
3. Check Firebase Firestore rules allow read access
4. Refresh the page

### Issue: "Media upload fails"
**Solution**:
1. Check file size and format
2. Verify Cloudinary configuration in .env
3. Check internet connection
4. Try with smaller test files first

### Issue: "Can't access admin dashboard"
**Solution**:
1. Verify admin user exists in Firebase Auth
2. Check login credentials
3. Clear browser cache
4. Check Firebase Auth configuration

### Issue: "Posts appear in dashboard but not on news page"
**Solution**:
1. Check browser console on news page
2. Look for Firebase query errors
3. Verify post data structure in Firestore
4. Check if posts have required fields (title, content, category)