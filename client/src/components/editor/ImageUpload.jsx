// components/ui/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { uploadService } from '../../services/uploadService';
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const ImageUpload = ({ onImageUpload, onImageRemove, currentImage, error, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadService.uploadImage(file, {
        folder: 'blog-posts',
        quality: 80,
        transformations: {
          width: 1200,
          height: 630,
          crop: 'limit'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      if (result.success) {
        onImageUpload({
          url: result.data.imageUrl,
          publicId: result.data.imagePublicId
        });
      } else {
        alert(result.message || 'Failed to upload image');
      }
    } catch (error) {
      alert('Failed to upload image. Please try again.', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Create a synthetic event for handleFileSelect
      const syntheticEvent = { target: { files: [file] } };
      handleFileSelect(syntheticEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (currentImage) {
    return (
      <div className="space-y-3">
        <div className="relative group">
          <img
            src={currentImage}
            alt="Featured post"
            className="w-full h-64 object-cover rounded-lg border border-gray-300"
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-red-700"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">Click the button below to change the image</p>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      
      {uploading ? (
        <div className="space-y-3">
          <LoadingSpinner size="md" />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        </div>
      ) : (
        <>
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP up to 5MB
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUpload;