# Media Library System Guide

## Overview
The Media Library is a comprehensive file management system that allows administrators to easily upload, organize, and manage all types of media files including photos, videos, audio files, and documents.

## 🚀 Key Features

### ✅ **Easy File Upload**
- **Drag & Drop**: Simply drag files from your computer and drop them into the upload area
- **Click to Upload**: Click the upload area or file type icons to select files
- **Multiple Files**: Upload multiple files at once
- **File Type Icons**: Click specific icons for Images, Videos, Audio, or Documents

### ✅ **Supported File Types & Limits**
- **Images**: PNG, JPG, GIF, WebP (up to 10MB each)
- **Videos**: MP4, AVI, MOV, WebM (up to 100MB each)
- **Audio**: MP3, WAV, OGG, M4A (up to 50MB each)
- **Documents**: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX (up to 20MB each)

### ✅ **Organization Features**
- **Categories**: Organize files by General, News, Events, Charity, Education, Community, Leadership, Programs, Documents
- **Search**: Find files quickly by name or category
- **Filters**: Filter by file type and category
- **View Modes**: Switch between grid and list views

### ✅ **File Management**
- **Preview**: View images, videos, and audio files directly
- **Download**: Download any file to your computer
- **Delete**: Remove unwanted files
- **Details**: View file information (size, upload date, category, etc.)

## 📍 **How to Access**

### **For Administrators:**
1. Login to admin dashboard at `/admin/login`
2. Click the **"Media Library"** button in the dashboard header
3. Or navigate directly to `/admin/media-library`

## 🎯 **How to Use**

### **Uploading Files**

#### **Method 1: Drag & Drop**
1. Go to the "Upload Files" tab
2. Select a category for your files
3. Drag files from your computer into the upload area
4. The area will highlight when files are over it
5. Drop the files and they'll be selected automatically
6. Click "Upload Files" to start uploading

#### **Method 2: Click to Select**
1. Go to the "Upload Files" tab
2. Select a category for your files
3. Click the main upload area OR click specific file type icons:
   - 📷 **Images** icon for photos
   - 🎥 **Videos** icon for video files
   - 🎵 **Audio** icon for audio files
   - 📄 **Documents** icon for documents
4. Select one or multiple files from your computer
5. Click "Upload Files" to start uploading

#### **Method 3: Quick Type Upload**
1. Click directly on the file type cards (Images, Videos, Audio, Documents)
2. This will open a file picker filtered for that specific file type
3. Select your files and they'll be ready to upload

### **Managing Files**

#### **Browsing Files**
1. Go to the "Browse Library" tab
2. Use the search box to find specific files
3. Use the dropdown filters to filter by:
   - **File Type**: All Types, Images, Videos, Audio, Documents
   - **Category**: All Categories, General, News, Events, etc.
4. Switch between Grid and List view using the view buttons

#### **File Actions**
- **👁️ View**: Click the eye icon to see file details and preview
- **⬇️ Download**: Click the download icon to save file to your computer
- **🗑️ Delete**: Click the trash icon to permanently remove the file

### **File Details**
When you click the eye icon on any file, you'll see:
- Full-size preview (for images and videos)
- Original filename
- File type and size
- Upload date and category
- Direct download link
- Delete option

## 🔧 **Technical Details**

### **File Storage**
- Files are uploaded to **Cloudinary** for reliable cloud storage
- File metadata is stored in **Firebase Firestore**
- Each file gets a unique ID and secure URL

### **Database Structure**
Files are stored in the `mediaLibrary` collection with:
- `id`: Unique identifier
- `name`: System-generated filename
- `originalName`: Original filename from upload
- `url`: Cloudinary URL for accessing the file
- `type`: File type (image, video, audio, document)
- `size`: File size in bytes
- `category`: Selected category
- `uploadDate`: Timestamp of upload

### **File Processing**
- **Images**: Automatically optimized for web delivery
- **Videos**: Stored with original quality, can be streamed
- **Audio**: Compressed for efficient streaming
- **Documents**: Stored as-is for download

## 🚨 **Troubleshooting**

### **Upload Issues**
**Problem**: Files won't upload
**Solutions**:
1. Check file size limits (Images: 10MB, Videos: 100MB, Audio: 50MB, Documents: 20MB)
2. Ensure file format is supported
3. Check internet connection
4. Try uploading one file at a time
5. Clear browser cache and refresh

**Problem**: Upload is very slow
**Solutions**:
1. Check internet connection speed
2. Try uploading smaller files first
3. Upload files one at a time instead of batch upload
4. Close other browser tabs to free up memory

### **File Display Issues**
**Problem**: Files don't appear in library
**Solutions**:
1. Refresh the page
2. Check if upload actually completed (look for success message)
3. Try different category filters
4. Check browser console for errors

**Problem**: Can't preview files
**Solutions**:
1. Ensure file uploaded successfully
2. Check if file format is supported for preview
3. Try downloading the file to verify it's not corrupted
4. Clear browser cache

### **Permission Issues**
**Problem**: Can't access Media Library
**Solutions**:
1. Ensure you're logged in as admin
2. Check admin permissions in Firebase
3. Try logging out and back in
4. Clear browser cookies and cache

## 💡 **Best Practices**

### **File Organization**
1. **Use Categories**: Always select appropriate categories when uploading
2. **Descriptive Names**: Use clear, descriptive filenames before uploading
3. **Regular Cleanup**: Periodically review and delete unused files
4. **Size Optimization**: Compress large files before uploading when possible

### **Upload Tips**
1. **Batch Upload**: Upload multiple related files at once
2. **Check Previews**: Always preview files after upload to ensure quality
3. **Backup Important Files**: Keep local copies of important files
4. **Test Different Formats**: Some formats work better than others for web use

### **Performance Tips**
1. **Optimize Images**: Use JPEG for photos, PNG for graphics with transparency
2. **Compress Videos**: Use MP4 format for best compatibility
3. **Audio Quality**: Use MP3 for general audio, WAV for high quality
4. **Document Formats**: PDF is preferred for documents

## 🔗 **Integration**

### **Using Files in Posts**
1. Upload files to Media Library first
2. When creating posts, you can reference the file URLs
3. Copy file URLs from the file details view
4. Use the MediaSelector component (coming soon) to pick files directly

### **File URLs**
All uploaded files get permanent URLs that can be used:
- In news posts and articles
- In website content
- For downloads and sharing
- In external applications

## 📈 **Future Enhancements**
- Direct integration with CreatePost page
- Bulk file operations (delete, move, etc.)
- File versioning and history
- Advanced image editing tools
- Automatic file optimization
- File sharing and permissions
- Usage analytics and reporting