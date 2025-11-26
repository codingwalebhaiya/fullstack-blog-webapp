// services/uploadService.js
import API from "../utils/api";

export const uploadService = {
  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    } = options;

    const errors = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Upload single image
  async uploadImage(file, options = {}) {
    try {
      // Validate file first
      const validation = this.validateFile(file, options);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await API.post('/api/v1/posts/post-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        onUploadProgress: options.onUploadProgress || (() => {})
      });

      return {
        success: true,
        data: response.data,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to upload image',
        error: error.response?.data
      };
    }
  },
};