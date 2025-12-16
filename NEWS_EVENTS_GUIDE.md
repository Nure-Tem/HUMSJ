# News & Events Management System

## Overview
The HUMSJ website now includes a complete news and events management system that allows administrators to create, manage, and display news articles and events.

## Features

### For Administrators
1. **Create Posts**: Admin can create news articles and events with rich content
2. **Media Upload**: Support for images, videos, and audio files via Cloudinary
3. **Categories**: Organize content by categories (General, Education, Charity, etc.)
4. **Event Management**: Special fields for events including event dates
5. **Content Management**: View, edit, and delete posts from the admin dashboard
6. **Multi-Media Support**: Upload and display images (up to 5MB), videos (up to 50MB), and audio files (up to 20MB)

### For Visitors
1. **News Page**: Browse all news and events with filtering by category
2. **Responsive Design**: Mobile-friendly layout with image galleries
3. **Social Media Integration**: Links to Facebook, Instagram, and Telegram
4. **Search & Filter**: Filter content by categories

## How to Use

### Creating a New Post
1. Login to admin dashboard at `/admin/login`
2. Click "Create Post" button in the dashboard
3. Fill in the post details:
   - **Post Type**: Choose between "News Article" or "Event"
   - **Title**: Enter a descriptive title (5-100 characters)
   - **Category**: Select appropriate category
   - **Event Date**: (For events only) Set the event date and time
   - **Content**: Write the full article content (minimum 20 characters)
   - **Media Files**: Upload optional media files:
     - **Image**: PNG, JPG, GIF up to 5MB
     - **Video**: MP4, AVI, MOV up to 50MB  
     - **Audio**: MP3, WAV, OGG up to 20MB
4. Click "Publish" to make the post live

### Managing Posts
1. Go to Admin Dashboard → Posts tab
2. View all published posts with thumbnails
3. Click the eye icon to view full details
4. Click the trash icon to delete posts
5. Posts are automatically displayed on the News page

### Categories Available
- **News**: General, Education, Charity, Community, Announcement
- **Events**: Workshop, Lecture, Charity Event, Community Gathering, Religious Event

## Technical Details

### Database Structure
Posts are stored in Firebase Firestore under the "posts" collection with the following fields:
- `title`: Post title
- `content`: Full post content
- `type`: "news" or "event"
- `category`: Selected category
- `eventDate`: Event date (for events only)
- `imageUrl`: Cloudinary image URL (optional)
- `videoUrl`: Cloudinary video URL (optional)
- `audioUrl`: Cloudinary audio URL (optional)
- `imageName`: Original image filename (optional)
- `videoName`: Original video filename (optional)
- `audioName`: Original audio filename (optional)
- `author`: "HUMSJ Admin"
- `status`: "published"
- `timestamp`: Creation timestamp
- `views`: View count (future feature)
- `likes`: Like count (future feature)

### File Locations
- **Create Post Page**: `src/pages/CreatePost.tsx`
- **Admin Dashboard**: `src/pages/AdminDashboard.tsx`
- **News Display**: `src/pages/News.tsx`
- **Routes**: `src/App.tsx`

### Routes
- `/admin/create-post`: Create new posts (admin only)
- `/admin/dashboard`: Manage all content (admin only)
- `/news`: Public news and events page

## Integration
The system integrates with:
- **Firebase Firestore**: For data storage
- **Cloudinary**: For image uploads and management
- **React Router**: For navigation
- **Tailwind CSS**: For styling
- **Lucide Icons**: For UI icons

## Troubleshooting

### Posts Not Showing on News Page
If you create a post but it doesn't appear on the News page:
1. Check the browser console for any Firebase errors
2. Ensure your Firebase configuration is correct in `.env`
3. Verify that the post was saved successfully in the Admin Dashboard → Posts tab
4. Try refreshing the News page
5. Check if there are any network connectivity issues

### Media Upload Issues
If media files fail to upload:
1. Verify Cloudinary configuration in `.env`
2. Check file size limits (Image: 5MB, Video: 50MB, Audio: 20MB)
3. Ensure file formats are supported
4. Check internet connection stability
5. Try uploading smaller files first

### Admin Access Issues
If you can't access the admin dashboard:
1. Ensure you're using the correct login credentials
2. Check Firebase Authentication configuration
3. Verify the admin user exists in Firebase Auth
4. Clear browser cache and cookies
5. Try logging in from an incognito/private window

## Future Enhancements
- Post editing functionality
- Draft posts and scheduling
- Post scheduling for future publication
- View and like counters with analytics
- Comment system for community engagement
- Email notifications for new posts
- RSS feed generation
- Advanced media gallery with lightbox
- Post categories management interface
- Search functionality within posts
- Social media auto-posting integration
- Multi-language support for posts