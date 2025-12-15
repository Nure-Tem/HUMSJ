// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: "dzmjhapvj",
  apiKey: "858177415771187",
  uploadPreset: "humsj_uploads", // You'll need to create this in Cloudinary dashboard
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Get optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push("c_fill", "q_auto", "f_auto");

  const transformString = transformations.join(",");
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformString}/${publicId}`;
};
